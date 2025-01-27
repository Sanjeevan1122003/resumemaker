const express = require("express");
const argon2 = require("argon2");
const path = require("path");
const mysql = require("mysql2");

const express = require('express');
const app = express();

const PORT = process.env.PORT || 30000; // Fallback to 3000 if PORT is not set


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Create a connection pool to the MySQL database
const db = mysql.createPool({
  host: "localhost", // Replace with your MySQL host
  user: "sanjeevan", // Replace with your MySQL username
  password: "Sandy@4253", // Replace with your MySQL password
  database: "resume_maker", // Replace with your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

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
  const hasedPassword = await argon2.hash(password);
  // Check if username or email already exists
  const checkQuery = "SELECT * FROM users_credentials WHERE username = ? OR email = ?";
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).send("Error signing up user");
    }

    if (results.length > 0) {
      return res.status(400).send("Username or Email already exists");
    }

    // Insert new user into the database
    const insertQuery = "INSERT INTO users_credentials (firstname, surname, username, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(insertQuery, [firstname, surname, username, gender, email, hasedPassword], (err) => {
      if (err) {
        console.error("Error inserting new user:", err);
        return res.status(500).send("Error signing up user");
      }

      res.sendFile(path.join(__dirname, "public/successful.html"));
    });
  });
});

// Login route
app.post("/userlogin/", (req, res) => {
  const { username, password } = req.body;

  const loginQuery = "SELECT * FROM users_credentials WHERE username = ?";
  db.query(loginQuery, [username], async (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).send("Error logging in");
    }

    if (results.length === 0) {
      return res.status(401).send("The username doesn't exist");
    }

    const user = results[0];

    try {
      // Compare the plaintext password with the hashed password
      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      res.sendFile(path.join(__dirname, "public/successful.html"));
    } catch (err) {
      console.error("Error verifying password:", err);
      return res.status(500).send("Error logging in");
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

