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

  jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
    if (error) {
      response.status(401);
      response.send("Invalid JWT Token");
    } else {
      req.email = payload.email;
      next();
    }
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
app.get("/login", (req, res) => {
  return res.sendFile(path.join(__dirname, "public/login.html"));
});


// Signup route
app.post("/usersignup/", async (req, res) => {
  const { firstname, secondname, username, gender, email, password } = req.body;
  const hashedPassword = await argon2.hash(password);

  const checkQuery = "SELECT * FROM users_credentials WHERE email = $2";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).send("Error signing up user");
    }

    if (results.rows.length > 0) {
      res.sendFile(path.join(__dirname, "public/login.html"));
    } else {
      const insertQuery = "INSERT INTO users_credentials (firstname, secondname, username, gender, email, password) VALUES ($1, $2, $3, $4, $5, $6)";
      db.query(insertQuery, [firstname, secondname, username, gender, email, hashedPassword], (err) => {
        if (err) {
          console.error("Error inserting new user:", err);
          return res.status(500).send("Error signing up user");
        } else {
          res.redirect("/dashboard/");
        }
      });
    }
  });
});

// Login route
app.post("/userlogin", (req, res) => {
  const { username, email, password } = req.body;
  const query = "SELECT * FROM users_credentials WHERE email = $1";
  db.query(query, [email], async (err, results) => {
    if (err || results.rows.length === 0) {
      return res.status(401).send("Invalid username or email");
    }

    const user = results.rows[0];
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    } else {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

      // Set cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
      });

      res.redirect("/dashboard");
    }
  });
});

app.get("/dashboard", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/userdetails", authenticate, (req, res) => {
  const query = "SELECT firstname, secondname, username, gender FROM users_credentials WHERE email = $1";
  db.query(query, [req.email], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ error: "Error fetching user data" });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = results.rows[0];
    res.json({ user });
  });
});



// ✅ Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}/`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


module.exports = app;

