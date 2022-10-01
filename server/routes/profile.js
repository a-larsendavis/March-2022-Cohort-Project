const router = require('express').Router();

// Require User Model from the models folder
const User = require('../models/User');
const Posts = require('../models/Posts');

// authentication middleware
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  };

// get user profile page  
router.get('/profile', isLoggedIn, (req, res) =>{
    // 1. read user profile from DB
    console.log(req.session.passport.user);
    User.findById(req.session.passport.user, (err, result) => {
      if (err){
          console.log(err);
      }
      else{
          console.log("Result : ", result);
          // 2. pass user profile into profile.ejs 
          res.render("profile", {userResult: result});
      }
    })
  })

// Update user profile data 
router.post("/sendData", isLoggedIn, (req, res) =>{
    console.log(req.body)
    // user session user to find/update user info in db
    User.findByIdAndUpdate(req.session.passport.user,
        {
            $set : {
                fullname: req.body.fullname,
                birth: req.body.birth,
                email: req.body.email,
                zipcode: req.body.zipcode,
                address: req.body.address,
                phone: req.body.phone,
                primephone: req.body.primephone,
                ername:req.body.ername,
                erphone:req.body.erphone,
                userpartner:req.body.userpartner,
                primephysician:req.body.primephysician,
                partnerbirth:req.body.partnerbirth,

            }
        },
        // redirect to same page, rendered data should be up to date
        (err, user) =>{
            res.redirect("/profile")
        })
})

//export module
module.exports = router;