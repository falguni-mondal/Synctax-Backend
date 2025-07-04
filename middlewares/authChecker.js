const jwt = require("jsonwebtoken");
const keys = require("../config/keys-config");

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    next();
  }

  if (token === "") {
    req.user = null;
    next();
  }

  const data = jwt.verify(token, keys.JWT_KEY);
  req.user = data;
  next();
};

module.exports = isLoggedIn;
