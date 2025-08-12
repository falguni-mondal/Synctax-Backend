const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/authChecker");

const { createSnippet, findSnippet } = require("../controllers/snippet-controller");


router.post("/create", isLoggedIn, createSnippet);
router.post("/find", isLoggedIn, findSnippet);

module.exports = router;