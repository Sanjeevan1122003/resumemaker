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

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send("Something went wrong. Please try again.");
});

// ✅ Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).send("Unauthorized: Invalid token");
    }
    req.email = decoded.email;
    next();
  });
};

// ✅ Serve Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ✅ Serve Signup Page
app.get("/signup/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/sign.html"));
});

// ✅ Serve Login Page (Fix: Add return after res.redirect)
app.get("/login/", (req, res) => {
  const token = req.cookies.auth_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (!err) {
        return res.redirect("/dashboard/"); 
      }
    });
  }
  return res.sendFile(path.join(__dirname, "public/login.html")); 
});

// ✅ Serve Dashboard Page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

// ✅ Fetch User Data (Ensuring Only One Response)
app.get("/userdata", authenticate, async (req, res) => {
  try {
    const query = "SELECT * FROM users_credentials WHERE email = $1";
    const result = await db.query(query, [req.email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

// ✅ Signup Route (Fix: Ensure Only One Response is Sent)
app.post("/usersignup/", async (req, res) => {
  const { firstname, secondname, username, gender, email, password } = req.body;
  const hashedPassword = await argon2.hash(password);

  try {
    const checkQuery = "SELECT * FROM users_credentials WHERE email = $1";
    const checkResult = await db.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).send("Email is already registered. Please login.");
    }

    const insertQuery = `
      INSERT INTO users_credentials (firstname, secondname, username, gender, email, password) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email
    `;
    const newUser = await db.query(insertQuery, [firstname, secondname, username, gender, email, hashedPassword]);

    const { id, email: userEmail } = newUser.rows[0];
    const token = jwt.sign({ id, email: userEmail }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.cookie("auth_token", token, { httpOnly: true, secure: false });

    return res.redirect("/dashboard/");
  } catch (err) {
    console.error("Error signing up user:", err);
    return res.status(500).send("Error signing up user"); 
  }
});

// ✅ Login Route (Fix: Ensure Only One Response)
app.post("/userlogin/", async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.cookie("auth_token", token, { httpOnly: true, secure: false });

    return res.redirect("/dashboard/");
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Error logging in user");
  }
});

// ✅ Logout Route
app.get("/logout/", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/login/");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

module.exports = app;
