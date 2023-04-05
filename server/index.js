const express = require("express");
const app = express();

const cors = require("cors");

const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      "mongodb://0.0.0.0:27017/full-stack-app"
    );
    console.log(con.connection.host);
  } catch (error) {
    console.log(error.message);
  }
};
connectDB();

app.get("/hello", (req, res) => {
  res.send("hello world!!");
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return { status: "error", error: "Invalid Login" };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        email: req.body.email,
        name: user.name,
      },
      "secret123"
    );

    return res.json({ status: "OK", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Duplicate email" });
  }

  console.log(req.body);
});

app.get("/api/quote", async (req, res) => {
  const token = req.header("x-access-token");

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "OK", quote: user.quote });
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.header("x-access-token");

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });
    console.log(req.body);
    return res.json({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(1337, () => {
  console.log("Server started on PORT 1337.");
});
