const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username : {
    type : String,
    minLength : 6,
    required : true,
    trim : true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  projects: {
    type: Array,
    default: [],
  },
  snippets: {
    type: Array,
    default: [],
  },
  posts : {
    type : Array,
    default : []
  },
  saved : {
    type : Array,
    default : []
  },
  followings: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  image: {
    type: String,
  },
}, {timeStamps : true});

module.exports = mongoose.model("user", userSchema);