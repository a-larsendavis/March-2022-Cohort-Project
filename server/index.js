// FOUNDATION

const express = require("express");
const app = express();






// CONNECTION
const mongoose = require("mongoose");
//const url = `${}/${}`

let connectionObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    user: "acc",
    pass: "acc_rocks_2020",
  };