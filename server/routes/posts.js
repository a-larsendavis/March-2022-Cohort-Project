const router = require('express').Router();
//const passport = require("passport");


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


//get resources page
router.get('/resources', isLoggedIn, (req, res) =>{
    res.render("resources");
});

  //get events page
router.get('/events', isLoggedIn, (req, res) =>{
    res.render("events");
});

  //get neighborhoodwatch resource page
router.get('/neighborhoodwatch', isLoggedIn, (req, res) =>{
    res.render("neighborhoodwatch");
});

//get restaurant resource page
router.get('/restaurants', isLoggedIn, (req, res) =>{
    res.render("restaurants");
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

/// !!! DOES NOT WORK
//get neighborhood page (fetch data from db and send to thread page)
router.get("/neighborhood", isLoggedIn, (req, res) =>{
    console.log(req.session.passport.user) 
    let zippy = User.findById({_id: req.session.passport.user})
    console.log(`zippy: ${zippy}`)
    //console.log(req.session.passport) 
    //let allPosts = [{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-04T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-04T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-04T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"}]
    let allPosts = Posts.find({_id: req.session.passport.user});
    //console.log(allPosts);
    // console.log(req.session.passport)
    // //fetch all quotes from db
    // User.findOne(req.session.passport.user, {username: req.session.passport.username})
    res.render("neighborhood", {allPosts: allPosts});
})



//get submit page
router.get("/neighborhoodPost", (req, res) =>{
    console.log("USERNAME: ", res.user)
    if(req.isAuthenticated()){
        console.log(req.body)
        res.render("neighborhoodPost")
    }else{
        res.redirect("/login");
    }
});

//POST
//Submit a neighborhood post
router.post("/submit", async (req, res) =>{
    console.log("POST DESCRIPTION", req.body.postit)
    console.log("bgColor: ", req.body.bgcolor.substring(1))
    try{
        const post = new Posts({
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
