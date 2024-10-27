const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://praveen_179:praveen1234@cluster0.xvo6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/devTinder"
  );
};

module.exports = connectDB;
