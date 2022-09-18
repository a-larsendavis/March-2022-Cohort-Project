const router = require('express').Router();
const passport = require("passport");


//Require User Model fromt he models folder
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
// Neighborhood Thread Page (Home)
router.get('/neighborhood', isLoggedIn, (req, res) =>{
  res.render('neighborhood');
})

router.get('/profile', isLoggedIn, (req, res) =>{
  res.render("profile");
})


//Update user profile data
router.post("/sendData", isLoggedIn, (req, res) =>{
    console.log(req.session.passport.user)
    console.log(req.body)
    User.findByIdAndUpdate(req.session.passport.user,
        {
            $set : {
                fullname: req.body.fullname,
                birth: req.body.birth,
                email: req.body.email,
                zipcode: req.body.zipcode,
                address: req.body.address,
                phone: req.body.phone,
            }
        },
        (err, user) =>{
            res.redirect("/profile")
        })
})


//get neighborhood page (fetch data from db and send to thread page)
router.get("/neighborhood", async (req, res) =>{
    
    try{
        //fetch all quotes from db
        const allPosts = await Posts.find({zipcode: `${req.body.zipcode}`});
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
router.post("/submit/username/:username", async (req, res) =>{
    console.log("POST DESCRIPTION", req.body.postit)
    console.log("USERNAME: ", req.body.username)
    console.log("ZIPCODE: ", req.body.zipcode)
    console.log("bgColor: ", req.body.bgcolor.substring(1))
    try{
        const post = new Posts({
            username: req.body.username,
            zipcode: req.body.zipcode,
            postit: req.body.postit,
            bgColor: req.body.bgcolor.substring(1) //bc color will send in hex format (#eeeee) so remove "#"
        });
        //save post
        const savePost = post.save();
        //redirect to posts if successful
        !savePost && res.redirect("/submit");
        res.redirect("/neighborhood")
    }catch(err){
        res.send(err)
    }
})

//like posts



//export
module.exports = router;
