require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("index", "views");

const userRouter = require("./routes/user");

app.use("/.netlify/functions/api/user", userRouter); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
