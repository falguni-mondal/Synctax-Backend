const mongoose = require("mongoose");
const dbgr = require("debug")("development : mongoose");

const connectToDB = () => {
  mongoose
    .connect(`${process.env.MONGODB_URI}synctax`)
    .then(() => {
      dbgr("DB connected!");
    })
    .catch((err) => {
      dbgr(err.message);
    });
};

module.exports = connectToDB;