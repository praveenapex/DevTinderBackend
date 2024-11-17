const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
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

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const ALLOWED_STATUS = ["interested", "ignored"];
      if (toUserId === String(fromUserId)) {
        return res.status(400).json({
          status: false,
          message: "Cannot send yourself a connection",
        });
      }

      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Status is invalid",
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      const existingRecord = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRecord) {
        return res.status(400).json({
          status: false,
          message: "cannot sent the request to same person again",
        });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      return res.status(200).send({
        status: true,
        message: "Connection request is added",
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "ERROR" + error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid request status" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ status: false, message: "no connection request found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      return res.status(200).json({
        status: true,
        message: "Successfully changed the status",
        data,
      });
    } catch (error) {
      console.log("Error: " + error.message);
      return res.status(500).json({ status: false, message: error.message });
    }
  }
);

module.exports = {
  requestRouter,
};
