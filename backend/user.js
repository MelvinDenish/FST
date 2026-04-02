const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/userDB1").then(() => console.log("connected")).catch((err) => console.log(err.message));
const User = mongoose.model("User", {
  email: String,
  password: String
});
app.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json({ user });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  const user = await User.findOne(req.body);
  console.log("hello", user);
  res.json({ user });
});
app.listen(3001, () => console.log("User Service running"));