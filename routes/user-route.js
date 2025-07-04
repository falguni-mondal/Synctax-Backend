const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/authChecker");
const { 
    createUser,
    loginUser,
    usernameChecker,
    checkAuth,
 } = require("../controllers/user-controller");


router.post("/create", createUser);
router.post("/signin", loginUser);
router.post("/check/username", usernameChecker);
router.get("/auth", isLoggedIn, checkAuth)

module.exports = router