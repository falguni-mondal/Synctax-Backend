const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const parser = require("cookie-parser");
const cors = require('cors');

const db = require("./config/mongoose-config");

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(parser());

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

// Routes
const userRouter = require("./routes/user-route");


//Route Initializing
app.use("/api/user", userRouter);

app.listen(3000, () => {
    console.log("Running!");
})