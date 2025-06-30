const mongoose = require("mongoose");
const dbgr = require("debug")("development : mongoose");

mongoose.connect(`${process.env.MONGODB_URI}/codelab`)
.then(() =>{
    dbgr("DB connected!");
})
.catch((err) => {
    dbgr(err.message);
})