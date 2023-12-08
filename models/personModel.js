const mongoose = require("mongoose");

const personModel = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },

  step: {
    type: Number,
    default: 0,
  },

  username: {
    type: String,
  },

  joriySana: {
    type: String,
  },

  manzil: {
    type: String,
  },

  mayitningMalumoti: {
    type: String,
  },

  farzandlariningIsmi: {
    type: String,
  },

  janazaVaqti: {
    type: String,
  },

  qabristonNomi: {
    type: String,
  },

  moljal: {
    type: String,
  },

  picture: {
    type: String,
  },
});

module.exports = mongoose.model("person", personModel);
