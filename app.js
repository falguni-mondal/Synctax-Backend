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

const frontendURL = process.env.FRONTEND_URL;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', `${frontendURL}`],
    credentials: true
}));

// Routes
const userRouter = require("./routes/user-route");
const snippetRouter = require("./routes/snippet-route");


//Route Initializing
app.use("/api/user", userRouter);
app.use("/api/snippet", snippetRouter);

app.listen(3000, () => {
    console.log("Running!");
})