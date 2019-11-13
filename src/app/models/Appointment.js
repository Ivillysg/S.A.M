const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    require: true
  },
  dateformat:{
    type:String,
    required:true
  },
  pacient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pacients",
    required: true
  }
});
module.exports = mongoose.model("appointment", AppointmentSchema);
