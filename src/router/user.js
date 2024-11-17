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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const usersToHide = new Set();
    connections.forEach((item) => {
      usersToHide.add(item.fromUserId.toString());
      usersToHide.add(item.toUserId.toString());
    });
    console.log(usersToHide);

    const feedUsers = await User.find({
      $and: [{ _id: { $nin: Array.from(usersToHide) } }],
    })
      .select("firstName lastName skills emailId about photoUrl")
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      status: true,
      feedUsers,
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
