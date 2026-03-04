require("dotenv").config();
const express = require("express");
const connectToDb = require("./config/db");
const cookieParser = require("cookie-parser");
const profile = require("./routes/profile");
const user = require("./routes/user");
const auth = require("./routes/auth");
const request = require("./routes/request");
const cors = require("cors");

const app = express();

require("./utils/nodeCron");

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello This is Home");
});

app.use("/auth", auth);
app.use("/profile", profile);
app.use("/user", user);
app.use("/request", request);
app.use(async (req, res, next) => {
  await connectToDb();
  next();
});

module.exports = app;
