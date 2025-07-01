const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { tokenGenerator } = require("../utils/tokenGenerator");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const check = await userModel.findOne({email: email});
    if(check) return res.status(400).json("Account already exist!");


    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(400).json("Something went wrong!");

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.status(400).json("Something went wrong!");

        const user = await userModel.create({
          username,
          email,
          password: hash,
        });

        const token = tokenGenerator(user);
        res.cookie("token", token); 
        res.status(200).json(user);
      });
    });
  } catch (err) {
    return res.status(400).json("Something went wrong!");
  }
};

const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json("Invalid Credentials");
        }
        bcrypt.compare(password, `${user.password}`, (err, result) => {

            if(err) res.status(400).json(err.message);
            if(!result){
                return res.status(400).json("Invalid Credentials");
            }
            const token = tokenGenerator(user);
            res.cookie("token", token);
            res.status(200);
        })
    }catch(err){
        res.status(400).json(err.message)
    }
}

const usernameChecker = async (req, res) => {
  const {username} = req.body;
  const user = await userModel.findOne({username});
  const available = user ? false : true;
  res.status(200).json({available});
}

module.exports={ createUser, loginUser, usernameChecker}