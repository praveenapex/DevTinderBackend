const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "interested", "ignored", "rejected"],
        message: `{VALUE} is not a valid status value`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.index({ fromUserId: 1 });

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequestModel",
  connectionRequest
);
module.exports = ConnectionRequestModel;
