const mongoose = require("mongoose");
const colorGenerator = require("../utils/colorGenerator");

const userSchema = mongoose.Schema({
  name : {
    type : String,
    minLength : 6,
    required : true,
  },
  pronouns : {
    type : String,
    required : true
  },
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
  isVerified : {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: undefined
  },
  bio : {
    type: String,
    default: ""
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
    default : "",
  },
  background : {
    type: String,
    default: () => colorGenerator(),
  },
}, {timeStamps : true});

module.exports = mongoose.model("user", userSchema);