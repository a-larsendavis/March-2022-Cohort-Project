require("dotenv").config();

const express  = require("express");
const app = express();
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

app.use(bodyParser.json())



//connection
const { DB, URI } = process.env;

const url = `${URI}/${DB}`;
let connectionObject = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
  user: "Maygomezatx",
  pass: "Webdev22",
};

mongoose
  .connect("mongodb+srv://Maygomezatx:Webdev22@maygomezatx.ckva9ij.mongodb.net/calendarDB?retryWrites=true&w=majority", connectionObject)
  .then(() => {
    console.log(`Connected to the ${DB} database`);
  })
  .catch((err) =>
    console.log(`Issues connecting to the ${DB} database: `, err)
  );

app.use("/api/calendar", require("./Controllers/CalendarController"));


  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`App on port ${port}`));

