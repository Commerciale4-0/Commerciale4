require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

app.use("/.netlify/functions/api/user", userRouter); // path must route to lambda
app.use("/.netlify/functions/api/admin", adminRouter);

module.exports = app;
module.exports.handler = serverless(app);
