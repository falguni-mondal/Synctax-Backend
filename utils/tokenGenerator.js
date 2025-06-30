const jwt = require("jsonwebtoken");
const keys = require("../config/keys-config");

const tokenGenerator = (user) => {
    return jwt.sign({id : user._id, email : user.email}, `${keys.JWT_KEY}`)
}

module.exports.tokenGenerator = tokenGenerator;