const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user.length !== 0) {
      res.send(user);
    } else {
      res.status(404).send("Users not found");
    }
  } catch (error) {
    console.log(error);
    res.send("Error while getting a users");
  }
});

module.exports = {
  requestRouter,
};
