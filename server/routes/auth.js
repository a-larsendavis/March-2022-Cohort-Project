const router = require('express').Router();
const passport = require("passport");
const User = require('../models/User');


//Require User Model from models folder
const UserModel = require('../models/User');

//Create passport local strategy
passport.use(UserModel.createStrategy());


// Serialize and deserialize user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});


//register user in db
router.post("/auth/signup", function(req, res) {
  var newUser = new UserModel({username: req.body.username, zipcode: req.body.zipcode});
  console.log(newUser);
  UserModel.register(newUser, req.body.password, function(err, user){
      if(err){ //Return to signup page if error logging in
        //   console.log(url)
          console.log(err);
          return res.render("signup")//, { data: err }
      } else { //redirect home if successful login
          passport.authenticate("local")(req, res, function(){
              res.redirect("/neighborhood");
          });
      }
  })
});
// router.post("/auth/signup", async (req, res) =>{
//     try{
//         //register user
//         const registerUser = await UserModel.register({username: req.body.username}, req.body.password );
//         if(registerUser){
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/neighborhood");
//             });
//         }else{
//             res.redirect("/login")
//         }
//     }catch(err){
//         res.send(err);
//     }
// });


//login user
router.post("/auth/login", (req, res) => {
    //create new user obj
    const user = new UserModel({
        username: req.body.username,
        password: req.body.password
    });
    //using possport login method - check user credentials
    req.login(user, (err) =>{
        if(err){
            console.log(err)
        } else{
            passport.authenticate("local")(req, res, function(){
                console.log(user);
                res.redirect("/neighborhood");
            });
        }
    });
});

//delete user
router.get("/delete/:_id", async (req, res) => { //:id allows us to delete an account by user id that is provided by mongoDB
    if(req.body.userId === req.params.id || req.body.isAdmin){
      try{
        User.findOneAndDelete({ _id: req.user.id }).then();
        return res.redirect("/login");
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  });

//logout
router.get("/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });


//export router
module.exports = router;