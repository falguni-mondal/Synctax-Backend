const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { tokenGenerator } = require("../utils/tokenGenerator");
const nodemailer = require("nodemailer");
const keys = require("../config/keys-config");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, pronouns, username, email, password } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const unameRegex =
      /^(?!\d)(?=[A-Za-z0-9-]{6,}$)(?!.*--)(?!.*[^A-Za-z0-9-])(?=(?:.*[A-Za-z]))^(?!.*-.*-)(?!^-)(?!.*-$)[A-Za-z0-9-]+$/;

    if (
      !unameRegex.test(username) ||
      !passwordRegex.test(password) ||
      email.split(" ").join("") === "" ||
      name.split(" ").join("").length < 6 ||
      pronouns === ""
    ) {
      return res.status(402).json("Invalid Credentials!");
    }

    const check = await userModel.findOne({ email: email });
    if (check) return res.status(402).json("Account already exist!");

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(401).json("Something went wrong!");

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.status(401).json("Something went wrong!");

        const user = await userModel.create({
          username,
          email,
          password: hash,
          name,
          pronouns,
        });

        const token = tokenGenerator(user);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({id: user._id, name: user.name, pronouns: user.pronouns, email : user.email, username: user.username, isVerified: user.isVerified, image: user.image, background: user.background});
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

      res.status(200).json({id: user._id, name: user.name, pronouns: user.pronouns, email : user.email, username: user.username, isVerified: user.isVerified, image: user.image, background: user.background});
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
  const { _id, name, pronouns, email, username, isVerified, image, background } = user;
  return res.status(200).json({ id: _id, name, pronouns, email, username, isVerified, image, background });
};

const userDeleter = async (req, res) => {
  try {
    const user = await userModel.deleteOne({ email: req.user.email });
    res.status(200).json({...user, status: "Deleted"});
  } catch (err) {
    throw new Error(err.message);
  }
};

const verificationLinkSender = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json("User not found!");
    }
    if (user.isVerified) {
      return res.status(200).json("User verified!");
    }

    const token = jwt.sign({ email }, `${keys.EMAIL_VERIFY_KEY}`, {
      expiresIn: "1h",
    });

    user.verificationToken = token;
    await user.save();

    const url = `${process.env.FRONTEND_TEST_URL}/user/verify/${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.APP_MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Email verification for CodeLab",
      html: `<p>Please click on <a style="background-color:rgb(23, 78, 180); color: white; padding: 8px 20px; border: none; border-radius: 5px;" href="${url}">Verify</a> to verify your email on CodeLab.</p>`,
    });

    res.status(200).json({status: "sent", token});
  } catch (err) {
    res.status(400).json(`${err.message}`);
  }
};

const userVerifier = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, `${keys.EMAIL_VERIFY_KEY}`);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json("User not found!");
    }
    if (user.verificationToken !== token) {
      return res.status(401).json("Token Mismathed!");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json("Verification Successfull!");
  } catch (err) {
    return res.status(400).json("Invalid or Expired token!");
  }
};

const userProfile = async (req, res) => {
  try{
  const userId = req.body.id;
  const tokenId = req.user.id;

  if(userId !== tokenId){
    logoutUser();
    return res.status(401).json({msg: "Please Signin to an account!"});
  }

    const user = await userModel.findOne({_id: tokenId});
    if(!user){
      return res.status(401).json({user: false, verified: false});
    }
    if(!user.isVerified){
      return res.status(401).json({user: true, verified: false});
    }
    const {_id, email, name, pronouns, username, image, bio, website, linkedin, github, projects, snippets, followings, followers} = user;

    res.status(200).json({id: _id, email, name, pronouns, username, image, bio, website, linkedin, github, projects, snippets, followings, followers});
  }catch(err){
    return res.status(400).json({err, msg: "Something went wrong!"});
  }


}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  usernameChecker,
  checkAuth,
  userDeleter,
  verificationLinkSender,
  userVerifier,
  userProfile,
};
