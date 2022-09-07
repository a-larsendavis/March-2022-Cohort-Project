const mongoose = require("mongoose");

let EventSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  title: String
});

let EventModel = new mongoose.model("Event", EventSchema);


module.exports = Event; 