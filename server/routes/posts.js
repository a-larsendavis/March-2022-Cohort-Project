const router = require('express').Router();
const passport = require("passport");


//Require User Model
const User = require('../models/User');
const Posts = require('../models/Posts');

// authentication middleware
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  };

//Create routes
//get main neighborhood thread page
router.get("/", (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect("/neighborhood")
    }else{
        res.render("login");
    }
});

//get signup page
router.get("/signup", (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect("neighborhood")
    }else{
        res.render("signup");
    }
});

//login page
router.get("/login", (req, res) =>{
    if(req.isAuthenticated()){
        res.render("/neighborhood")
    }else{
        res.render("login");
    }
});

router.get('/neighborhood', isLoggedIn, (req, res) =>{
  res.render('neighborhood');
})

router.get('/profile', isLoggedIn, (req, res) =>{
  res.render("profile");
})


//get neighborhood page (fetch data from db and send to thread page)
router.get("/neighborhood", async (req, res) =>{
    try{
        //fetch all quotes from db
        const allPosts = await Posts.find();
        res.render("neighborhood", {allPosts, isAuth:req.isAuthenticated() });
    }catch(err){
        res.send(err);
    }
})


//get submit page
router.get("/neighborhoodPost", (req, res) =>{
    if(req.isAuthenticated()){
        res.render("neighborhoodPost")
    }else{
        res.redirect("login");
    }
});


//POST
//Submit a neighborhood post
router.post("/submit", async (req, res) =>{
    try{
        const post = new Posts({
            postit:req.body.postit,
            bgColor: req.body.bgcolor.substring(1) //bc color will send in hex format (#eeeee) so remove "#"
        });
        //save post
        const savePost = post.save();
        //redirect to posts if successful
        !savePost && res.redirect("/submit");
        res.redirect("neighborhood")
    }catch(err){
        res.send(err)
    }
})

//like posts



//export
module.exports = router;
