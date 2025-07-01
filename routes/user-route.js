const express = require("express");
const router = express.Router();
const { 
    createUser,
    loginUser,
    usernameChecker,
 } = require("../controllers/user-controller");


router.post("/create", createUser);
router.post("/signin", loginUser);
router.post("/check/username", usernameChecker);

module.exports = router