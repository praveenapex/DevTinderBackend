const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", []);

    if (!requests) {
      return res.status(404).json({
        status: false,
        message: "No requests found",
      });
    }
    return res.status(200).send({
      profiles: requests,
    });
  } catch (error) {
    console.log("ERROR: " + error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", "");
    const connectionsData = connections.map((item) => item.fromUserId);
    return res.status(200).json({
      status: true,
      connections: connectionsData,
    });
  } catch (error) {
    console.log("ERROR: " + error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = userRouter;
