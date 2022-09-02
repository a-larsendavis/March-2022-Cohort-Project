require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//monogoose
const mongoose =require('mongoose');
const { DB, URI} = process.env;
const url = `${URI}/${DB}`;
let connectionObject = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
  user: "Maygomezatx",
  pass: "Webdev22",
};

mongoose
  .connect(url, connectionObject)
  .then(() => {
    console.log(`Connected to the ${DB} database`);
  })
  .catch((err) =>
    console.log(`Issues connecting to the ${DB} database: `, err)
  );


//// Schema
let formSchema = new mongoose.Schema({
    Fullname: String,
    Birth: String,
    Email: String,
    Zipcode: Number,
    Address:String,
    Phone:Number,
  });


  const FormModel = new mongoose.model('forms',formSchema)

  app.post('/sendData',(req, res)=>{
    console.log(req.body)
    let tempObj ={}
    for (key in req.body) {
       tempObj[key]= req.body[key]
    }

    console.log(tempObj)
    FormModel.create(tempObj,
        (error, result)=>{
            if(error) res.send(error.message)
            //res.send(result);
            res.redirect('/result')
         
        })
    });
 

app.get("/home", (req,res)=> {
    res.render("home.ejs")
});

app.get("/profile", (req,res)=> {
    res.render("profile.ejs")
});

app.get('/result', (req, res)=>{
    FormModel.find({}, (err, result)=>{
       if(err) res.send(err)
       res.render('result.ejs' ,{data: result})
    })
    
})
const port = process.env.PORT || 3000;
app.listen(port , ()=> console.log(`start app on port ${port}`));
