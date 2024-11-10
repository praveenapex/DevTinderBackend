const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateData } = require("./utils/validateData");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateData(req.body);
    const { emailId, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await user.save();
    res.send("User is added successfully");
  } catch (error) {
    console.log(error);
    res.send("Error while creating a user : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid credentils");
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      res.cookie("token", "fnrihgkjebjrlkmfjekcncfkjenfjkcr nj n");
      res.send("Login is successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    res.send("Error while creating a user : " + error.message);
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.email });
    if (user.length !== 0) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.send("Error while getting a user");
  }
});

app.get("/feed", async (req, res) => {
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

app.delete("/deleteUser", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.id);
    res.send("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.send("Internal server error");
  }
});

app.patch("/updateUser/:userId", async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
    ];
    const isValidated = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isValidated) {
      throw new Error("Cannot update the fields");
    }
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      runValidators: true,
    });
    res.send("User data is updated successfully");
  } catch (error) {
    console.log(error);
    res.send("Cannot update the fields" + error.message);
  }
});

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
