const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { tokenGenerator } = require("../utils/tokenGenerator");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const unameRegex =
      /^(?!\d)(?=[A-Za-z0-9-]{6,}$)(?!.*--)(?!.*[^A-Za-z0-9-])(?=(?:.*[A-Za-z]))^(?!.*-.*-)(?!^-)(?!.*-$)[A-Za-z0-9-]+$/;

    if (
      !unameRegex.test(username) ||
      !passwordRegex.test(password) ||
      email.trim() === ""
    ) {
      return res.status(400).json("Invalid Credentials!");
    }

    const check = await userModel.findOne({ email: email });
    if (check) return res.status(400).json("Account already exist!");

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

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(user);
      });
    });
  } catch (err) {
    return res.status(400).json("Something went wrong!");
  }
};

const loginUser = async (req, res) => {
  try {
    const { id, password } = req.body;

    let user = await userModel.findOne({ email: id });
    if (!user) {
      user = await userModel.findOne({ username: id });
      if (!user) return res.status(400).json("Wrong Credentials");
    }
    bcrypt.compare(password, `${user.password}`, (err, result) => {
      if (err) res.status(400).json("Something went wrong!");
      if (!result) {
        return res.status(400).json("Wrong Credentials");
      }
      const token = tokenGenerator(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return res.status(200).json(user);
    });
  } catch (err) {
    return res.status(400).json("Something went wrong!");
  }
};

const logoutUser = async (req, res) => {
  
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });

  res.status(200).json("Logged out Successfully!");
};

const usernameChecker = async (req, res) => {
  const { username } = req.body;
  const user = await userModel.findOne({ username });
  const available = user ? false : true;
  return res.status(200).json({ available });
};

const checkAuth = async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  return res.status(200).json(user);
};

module.exports = { createUser, loginUser, logoutUser, usernameChecker, checkAuth };
