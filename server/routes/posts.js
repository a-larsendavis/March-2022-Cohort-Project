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

// Create routes
// get main neighborhood thread page
router.get("/", (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect("/neighborhood")
    }else{
        res.render("login");
    }
});

// get signup page
router.get("/signup", (req, res) =>{
    if(req.isAuthenticated()){
        res.redirect("neighborhood")
    }else{
        res.render("signup");
    }
});

// authentication on login page
router.get("/login", (req, res) =>{
    if(req.isAuthenticated()){
        res.render("/neighborhood")
    }else{
        res.render("login");
    }
});

// get neighborhood page (fetch data from db and send to thread page)
router.get("/neighborhood", isLoggedIn, (req, res) =>{
    Posts.find({zipcode: req.user.zipcode}, (err, results)=>{
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
    }).sort(({createdAt: -1}))
  })


// get submit page
router.get("/neighborhoodPost", (req, res) =>{
    console.log("USERNAME: ", res.user)
    if(req.isAuthenticated()){
        console.log(req.body)
        res.render("neighborhoodPost")
    }else{
        res.redirect("/login");
    }
});

// POST
// Submit a neighborhood post
router.post("/submit", async (req, res) =>{

    // populate Post schema
    try{
        const post = new Posts({
            user: req.user.id,
            postit: req.body.postit,
            bgColor: req.body.bgcolor.substring(1), //bc color will send in hex format (#eeeee) so remove "#"
            zipcode: req.user.zipcode,
            username: req.user.username
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

// like posts
router.post("/like/:id", isLoggedIn, async (req, res) =>{
    try{
       //find the post to update likes
       const post = await Posts.findById(req.params.id);
    
       // check if the post has already been liked
      if(post.likes.filter(like => like.user.toString() === req.user.id).length> 0){
        return res.redirect('/neighborhood')
      }
      post.likes.unshift({ user : req.user.id});
      await post.save();
      return res.redirect('/neighborhood')
      res.json(post.likes);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//export
module.exports = router;