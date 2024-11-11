const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieparser = require("cookie-parser");
const { authRouter } = require("./router/auth");
const { profileRouter } = require("./router/profile");
const { requestRouter } = require("./router/request");
const PORT = 3000;

app.use(express.json());
app.use(cookieparser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connection is established..");
    app.listen(PORT, () => {
      console.log("Server is running on ", PORT);
    });
  })
  .catch((error) => {
    console.log("Error occurred while connecting to the database...", error);
  });
