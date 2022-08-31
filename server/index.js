require('dotenv').config() //grants access to all environment variables
// FOUNDATION  vLu*11fL

const express = require("express");
const app = express();
const { json } = require('express');
const passport = require('passport')
const LocalStrategy = require('passport-local');

//body parsers
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

let connectionObject = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
  user: "Maygomezatx",
  pass: "Webdev22",
};

// CONNECTION
const mongoose = require("mongoose");
const { URI, DB } = process.env;

const url = `${URI}/${DB}`;
mongoose
  .connect(url, connectionObject)
  .then(() => console.log(`Connected to ${DB}`))
  .catch(err => console.log(`Error connecting to ${DB}: ${err} `))

// BLUEPRINTS
const UserModel = require('./models/User');

app.use(require('express-session')({
  secret: "Blah blah blah",  // used to encrypt the user info before saving to db
  resave: false,             // save the session obj even if not changed
  saveUninitialized: false   // save the session obj even if not initialized
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// ROOT HANDLING
//Home Route
app.get('/', (req, res) => {
  res.redirect('/login')
})

//Sign up page - User creation and data input
app.get('/signup', (req, res) =>{
  res.render('signup')
})

app.get('/home', isLoggedIn, (req, res) =>{
  res.render('home');
})


//New user isn't redirected to their home page. Redirect to thread Page.
app.post("/signup", function(req, res) {
  var newUser = new UserModel({username: req.body.username});
  console.log(newUser);
  UserModel.register(newUser, req.body.password, function(err, user){
      if(err){ //Return to signup page if error logging in
          console.log(url)
          console.log(err);
          return res.render("signup")//, { data: err }
      } else { //redirect home if successful login
          passport.authenticate("local")(req, res, function(){
              res.redirect("/home");
          });
      }
  })
});

app.get("/login", (req, res) => {
  // console.log(req.body.username);
  res.render("login");
});

// Use our middleware to authenticate 
app.post(
  '/login', 
  passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}), 
function(req, res) {
  // nothing required as of now of callback function
  console.log(req.body)
});


//user:alexalex pw:123 zip:99876
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


//Update User info- PUT PROFILE PAGE
// Update - PUT
app.put("/profile:username", (req, res) => {
  let requestedUser = req.params.username;
  UserModel.findById(requestedUser, (error, item)=>{
    if(error) res.status(404).send({ error: "Username for updating does not exist" });
    else{
      item.save( (err, updatedItem)=>{
        if(err) res.status.send( { err: "Unable to update DB" });
        else res.json(updatedItem);
      })
    }
  })
});


// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Commune App listening in on PORT: ${PORT}`));
