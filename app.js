require("dotenv").config();
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 1050; 

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // host: "sql12.freesqldatabase.com",
  // user: "sql12759887",
  // password: "9YhMvsnxPt",
  // database: "sql12759887",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
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
      req.username = decoded.username;
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
  res.sendFile(path.join(__dirname, "public/successful.html"));
});

// Signup route
app.post("/usersignup/", async (req, res) => {
  const { firstname, surname, username, gender, email, password } = req.body;
  const hasedPassword = await argon2.hash(password);
  const checkQuery = "SELECT * FROM users_credentials WHERE username = ? OR email = ?";
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).send("Error signing up user");
    }

    if (results.length > 0) {
      res.sendFile(path.join(__dirname, "public/login.html"));
    }else{
      const insertQuery = "INSERT INTO users_credentials (firstname, surname, username, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(insertQuery, [firstname, surname, username, gender, email, hasedPassword], (err) => {
      if (err) {
        console.error("Error inserting new user:", err);
        return res.status(500).send("Error signing up user");
      }else{
        res.redirect("/dashboard/");
      }
    });
    }
  });
});

// Login route
app.post("/userlogin/", (req, res) => {
  const { username, email, password } = req.body;
    const query = "SELECT * FROM users_credentials WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send("Invalid username or email");
        }

        const user = results[0];
        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }else{
          const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);

        // Set cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false,
        });
        
        res.redirect("/dashboard");
      } 
    });       
});

app.listen(PORT , () => {
  console.log(`Server is running on ${PORT}`);
)};

module.exports = app;


