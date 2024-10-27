const express = require("express");
const connectDB = require("./config/database");
const app = express();
const PORT = 3000;

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
