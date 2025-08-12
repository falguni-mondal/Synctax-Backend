const mongoose = require("mongoose");

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
  bio: {
    type: String,
    default: ""
  },
  linkedin: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  github: {
    type: String,
    default: ""
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
  snippets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "snippet",
  }],
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
    data: Buffer,
    contentType: String,
  },
}, {timeStamps : true});

module.exports = mongoose.model("user", userSchema);