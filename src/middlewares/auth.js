const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const { id } = await jwt.verify(token, "Praveen@1234");
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({
      status: "false",
      message: error.message,
    });
  }
};

module.exports = {
  userAuth,
};
