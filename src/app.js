const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User is added successfully");
  } catch (error) {
    console.log(error);
    res.send("Error while creating a user");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection is established..");
    app.listen(PORT, () => {
      console.log("Server is running on ", PORT);
    });
  })
  .catch(() => {
    console.log("Error occurred while connecting to the database...");
  });
