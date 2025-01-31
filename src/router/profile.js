const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.delete("/deleteUser", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.id);
    res.send("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.send("Internal server error");
  }
});

profileRouter.put("/updateUser/:userId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.send(loggedInUser);
  } catch (error) {
    console.log(error);
    res.send("Cannot update the fields" + error.message);
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    return res.status(200).send({
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
});

profileRouter.get("/getUser", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.email });
    if (user.length !== 0) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.send("Error while getting a user");
  }
});

module.exports = {
  profileRouter,
};
