const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (v) => {
        if (!validator.isEmail(v)) {
          throw new Error("Enter a Valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Enter valid gender");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about..",
    },
    skills: {
      type: [String],
    },
    photo: {
      type: String,
      default:
        "https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
