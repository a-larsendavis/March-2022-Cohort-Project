require("dotenv").config(); //grants access to all environment variables
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { json } = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const ejs = require("ejs");
const morgan = require("morgan");
app.use(morgan("common"));

//require routers
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const profileRoute = require("./routes/profile")
const resourcesRoute = require("./routes/resources")


//body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//setup session
app.use(
  session({
    secret: process.env.SECRET, // used to encrypt the user info before saving to db
    resave: false, // save the session obj even if not changed
    saveUninitialized: false, // save the session obj even if not initialized
  })
);

//initialize passport
app.use(passport.initialize());

//use passport to deal w/ session
app.use(passport.session());

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
  .catch((err) => console.log(`Error connecting to ${DB}: ${err} `));

//use Routes
app.use("/", authRoute);
app.use("/", postRoute);
app.use("/", profileRoute);
app.use("/", resourcesRoute);

// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Commune App listening in on PORT: ${PORT}`)
);
