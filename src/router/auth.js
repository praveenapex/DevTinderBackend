const express = require("express");
const { validateData } = require("../utils/validateData");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateData(req.body);
    const { emailId, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await user.save();
    res.send("User is added successfully");
  } catch (error) {
    console.log(error);
    res.send("Error while creating a user : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid credentils");
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      var token = await jwt.sign({ id: user._id }, "Praveen@1234", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    res.send("Error while creating a user : " + error.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = {
  authRouter,
};
