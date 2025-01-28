const express = require("express");
const argon2 = require("argon2");
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

// const PORT = process.env.PORT || 1050; 

const db = mysql.createPool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
  host: "sql12.freesqldatabase.com",
  user: "sql12759887",
  password: "9YhMvsnxPt",
  database: "sql12759887",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// const authentication = async (res, req, next) => {
//   let
// }

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
  const { username, email, password, rememberme } = req.body;
  console.log(rememberme)
  const loginQuery = "SELECT * FROM users_credentials WHERE username = ?";
  db.query(loginQuery, [username], async(err, results) => {
    const user = results[0];
    console.log(user.email);
  console.log(user.password);
  if (!user.username) {
    return res.status(401).send("The username doesn't exist, Please signup the user");
  }

  if (user.email !== email) {
    return res.status(401).send("Invalid email");
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    return res.status(401).send("Invalid password");
  }

  if (rememberme === "rememberme") {
    const jwtToken = jwt.sign(user.username, "SECRET_KEY");
    console.log({ jwtToken });
    res.send({ jwtToken });
  }

  res.sendFile(path.join(__dirname, "public/successful.html"));
});
  });

  const authentication = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send("Invalid JWT Token");
    }
  
    const token = authHeader.split(" ")[1]; // Extract token
    jwt.verify(token, "SECRET_KEY", (err, payload) => {
      if (err) {
        return res.status(401).send("Invalid JWT Token");
      }
      req.username = payload.username; // Save userId for further use
      next(); // Proceed to the next middleware or route
    });
  };
  
  // Route protected with authentication middleware
  app.get("/user/", authentication, async (req, res) => {
    res.sendFile(path.join(__dirname, "public/successful.html")); // Send the successful.html file
  });
  
  
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000/`);
});

module.exports = app;


