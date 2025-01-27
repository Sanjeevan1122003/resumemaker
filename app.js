// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// MongoDB connection URI from environment variables
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// User schema for MongoDB
const userSchema = new mongoose.Schema({
  firstname: String,
  surname: String,
  username: { type: String, unique: true },
  gender: String,
  email: { type: String, unique: true },
  password: String, // Plain text password (for demo purposes)
});

const User = mongoose.model("User", userSchema);

// Route to render the index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route to render signup page
app.get("/signup/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/sign.html"));
});

// Route to render login page
app.get("/login/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

// Signup route
app.post("/usersignup/", async (req, res) => {
  const { firstname, surname, username, gender, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("Username or Email already exists");
    }

    // Create a new user with the plain text password
    const newUser = new User({
      firstname,
      surname,
      username,
      gender,
      email,
      password, // Storing password as plain text (not secure for production)
    });

    await newUser.save();  // Save the user to MongoDB
    res.sendFile(path.join(__dirname, "public/successful.html"));
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).send(error);
  }
});

// Login route
app.post("/userlogin/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send("The username doesn't exist");
    }

    // Check if the password matches (plain text comparison)
    if (user.password !== password) {
      return res.status(401).send("Invalid password");
    }

    res.sendFile(path.join(__dirname, "public/successful.html"));
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error logging in");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;

