require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const userRouter = require("./routes/user");
app.use("/.netlify/functions/api/user", userRouter); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
