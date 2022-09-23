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

//get pets resource page
router.get('/pets', isLoggedIn, (req, res) =>{
    res.render("pets");
});

//get pets resource page
router.get('/courses', isLoggedIn, (req, res) =>{
    res.render("courses");
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

//get user profile page  
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
// router.get("/neighborhood", isLoggedIn, (req, res) =>{
//     let userId = req.session.passport.user;
//     console.log(`userId: ${userId}`); 
//     //console.log(req.session.passport)  {_id: req.session.passport.user}
//     let allPosts = [{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-04T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-04T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-04T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"6D929B","postit":"A new post from me!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"},{"zipcode": "12345","bgColor":"F5FAFA","postit":"Someone missing a cat?!","img":"","likes":[],"createdAt" : "2022-09-10T02:35:06.410+0000","updatedAt" : "2022-09-10T02:35:06.410+0000"}]
//     //let allPosts = Posts.find();
//     //console.log(allPosts);
//     // console.log(req.session.passport)
//     // //fetch all quotes from db
//     // User.findOne(req.session.passport.user, {username: req.session.passport.username})
//     res.render("neighborhood", {allPosts: allPosts});
// })


// !!!TEST
router.get("/neighborhood", isLoggedIn, (req, res) =>{
    Posts.find({}, (err, results)=>{
      if(err){
        res.status(400).json({message: "Not able to find the data in the DB"}) 
      } else{
        if((results.length ===0)){
          console.log("Everything is good. Just no data.")
          res.send("No data in database")
        }else{
          
          res.render("neighborhood", {allPosts: results});
        }
      }
    })
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
router.post("/like", async (req, res) =>{
    console.log("in like route")
    try{
       //find the post to update likes
       const post = await post.findById(req.body.like);
       const updateLikes = await post.updateOne({like: post.like +1});
      //redirect to the neighborhood page 
      res.redirect('/neighborhood')
    }catch(err){
        res.send(err);
    }

})


//export
module.exports = router;
