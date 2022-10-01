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
  
// get resources page
router.get('/resources', isLoggedIn, (req, res) =>{
    res.render("resources");
});

// get events page
router.get('/events', isLoggedIn, (req, res) =>{
    res.render("events");
});

// get neighborhoodwatch resource page
router.get('/neighborhoodwatch', isLoggedIn, (req, res) =>{
    res.render("neighborhoodwatch");
});

// get restaurant resource page
router.get('/restaurants', isLoggedIn, (req, res) =>{
    res.render("restaurants");
});

// get pets resource page
router.get('/pets', isLoggedIn, (req, res) =>{
    res.render("pets");
});

// get pets resource page
router.get('/courses', isLoggedIn, (req, res) =>{
    res.render("courses");
});

// settings
router.get('/profileSettings', isLoggedIn, (req, res) => {
    res.render("settings")
});

// get account page
router.get('/account', isLoggedIn, (req, res) => {
    res.render("account")
});



module.exports = router; 