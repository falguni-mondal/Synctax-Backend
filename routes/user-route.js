const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/authChecker");
const { 
    createUser,
    loginUser,
    logoutUser,
    usernameChecker,
    checkAuth,
    userDeleter,
    verificationLinkSender,
    userVerifier,
 } = require("../controllers/user-controller");


router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/check/username", usernameChecker);
router.get("/auth", isLoggedIn, checkAuth);
router.get("/account/deactivate", isLoggedIn, userDeleter);
router.get("/verify/send", isLoggedIn, verificationLinkSender);
router.post("/verify/match", userVerifier);

module.exports = router