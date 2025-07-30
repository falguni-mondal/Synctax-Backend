const jwt = require("jsonwebtoken");
const keys = require("../config/keys-config");

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token || token === "") {
    req.user = null;
    return res.status(401).json("User not logged in!");
  }

  try{
    const data = jwt.verify(token, keys.JWT_KEY);
    req.user = data;
    next();
  }catch(err){
    req.user = null;
    return res.status(401).json("Invalid or Expired token!");
  }
};

module.exports = isLoggedIn;
