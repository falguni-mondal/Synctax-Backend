const express = require("express");
const router = express.Router();
const { 
    createUser,
    loginUser
 } = require("../controllers/user-controller");


router.post("/create", createUser);
router.post("/signin", loginUser)

module.exports = router