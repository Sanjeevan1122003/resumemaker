require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 1050;

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const authenticate = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }
    req.userId = decoded.userId;
    next();
  });
};

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
  const token = req.cookies.auth_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (!err) {
        return res.redirect("/dashboard/");
      }
    });
  }
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.get("/dashboard/", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

// Signup route
app.post("/usersignup/", async (req, res) => {
  const { firstname, secondname, username, gender, email, password } = req.body;
  const hashedPassword = await argon2.hash(password);

  try {
    // Check if the email already exists (since email is unique)
    const checkQuery = "SELECT * FROM users_credentials WHERE email = $1";
    const checkResult = await db.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).send("Email is already registered. Please login.");
    }

    // Insert the new user
    const insertQuery = `
      INSERT INTO users_credentials (firstname, secondname, username, gender, email, password) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    const newUser = await db.query(insertQuery, [firstname, secondname, username, gender, email, hashedPassword]);

    const userId = newUser.rows[0].id;

    // Generate token with user ID
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
    });

    res.redirect("/dashboard/");
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).send("Error signing up user");
  }
});

// Login route
app.post("/userlogin/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use email to find user since it's unique
    const query = "SELECT * FROM users_credentials WHERE email = $1";
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const user = result.rows[0];
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Error logging in user");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;



