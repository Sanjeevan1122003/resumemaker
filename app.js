require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const cookieParser = require("cookie-parser");
const fs = require("fs");

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
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public/sign.html"));
});

// Route to render login page
app.get("/login", (req, res) => {
  return res.sendFile(path.join(__dirname, "public/login.html"));
});

app.use("/templates", express.static(path.join(__dirname, "templates")));

// Signup route
app.post("/usersignup", async (req, res) => {
  const { firstname, secondname, username, gender, email, password } = req.body;

  try {
    const hashedPassword = await argon2.hash(password);

    const checkQuery = "SELECT * FROM users_credentials WHERE email = $1";
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({ error: "Server error. Please try again. 🥲" });
      }

      if (results.rows.length > 0) {
        return res.status(400).json({ error: "User already exists. Please log in. 😊" });
      } else {
        const insertQuery = `
          INSERT INTO users_credentials (firstname, secondname, username, gender, email, password)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        db.query(insertQuery, [firstname, secondname, username, gender, email, hashedPassword], (err) => {
          if (err) {
            console.error("Error inserting new user:", err);
            return res.status(500).json({ error: "Error signing up user. Please try again. 😣" });
          } else {
            return res.status(200).json({ message: "Signup successful! 😎" });
          }
        });
      }
    });
  } catch (error) {
    console.error("Hashing error:", error);
    return res.status(500).json({ error: "Unexpected error during signup. 🤯" });
  }
});

// Login route
app.post("/userlogin", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users_credentials WHERE email = $1";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Server error. Please try again. 😣" });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "No data found. You seem to be a new user, please sign up. 👍" });
    }

    const user = results.rows[0];
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect email or password. Please try again. 🥲" });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ message: "Login successful 😄" });
  });
});

app.get("/dashboard", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/userdetails", authenticate, (req, res) => {
  const email = req.email;
  const query = "SELECT firstname, secondname, username, gender, email FROM users_credentials WHERE email = $1";
  db.query(query, [email], (err, results) => {
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

// Route to save or update user form data
app.post('/resumedata', authenticate, async (req, res) => {
  // Get user email from middleware
  const emailID = req.email;

  // Destructure form fields from request body
  const {
    fullname, phone_number, job_role, email,
    school_name, school_marks, school_year, school_degree,
    intermediate_name, intermediate_degree, intermediate_course, intermediate_marks, intermediate_year,
    college_name, college_degree, college_course, college_marks, college_year,
    softSkills, technicalSkills, linkedin_Link, achievements, certificates, experiences, projects
  } = req.body;

  // Parse fields if they're sent as strings
  const ach = typeof achievements === "string" ? JSON.parse(achievements) : achievements;
  const certs = typeof certificates === "string" ? JSON.parse(certificates) : certificates;
  const exps = typeof experiences === "string" ? JSON.parse(experiences) : experiences;
  const projs = typeof projects === "string" ? JSON.parse(projects) : projects;

  // SQL query: simple INSERT — NO upsert logic!
  const query = `
    INSERT INTO user_details (
      emailid, fullname, phone_number, email, job_role,
      school_name, school_marks, school_year, school_degree,
      intermediate_name, intermediate_degree, intermediate_course, intermediate_marks, intermediate_year,
      college_name, college_degree, college_course, college_marks, college_year,
      softskills, technicalskills, linkedin_link, achievements, certificates, experiences, projects
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26
    )
  `;

  try {
    // Execute the query with values
    await db.query(query, [
      emailID, fullname, phone_number, email, job_role,
      school_name, school_marks, school_year, school_degree,
      intermediate_name, intermediate_degree, intermediate_course, intermediate_marks, intermediate_year,
      college_name, college_degree, college_course, college_marks, college_year,
      softSkills, technicalSkills, linkedin_Link,
      JSON.stringify(ach),
      JSON.stringify(certs),
      JSON.stringify(exps),
      JSON.stringify(projs),
    ]);

    // Respond success
    res.status(200).json({ message: "✅ Form data saved successfully." });
    console.log("Saved for:", emailID);

  } catch (err) {
    // Handle and log any error
    console.error("Error saving form data:", err);
    res.status(500).json({ error: "Error saving form data." });
  }
});

// Route to get user form data
app.get('/resumetemplates', authenticate, async (req, res) => {
  const email = req.email;
  const result = await db.query("SELECT * FROM user_details WHERE emailid = $1", [email]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "No data found." });
  }
  const data = result.rows[result.rows.length - 1];
  res.json(data);
});

app.post("/updateDetails", authenticate, (req, res) => {
  const email = req.email; // from the authenticate middleware
  const { updateUserName, updateFirstName, updateSecondName } = req.body;

  // Basic validation
  if (!updateUserName || !updateFirstName || !updateSecondName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const updateQuery = `
    UPDATE users_credentials
    SET username = $1, firstname = $2, secondname = $3
    WHERE email = $4
    RETURNING firstname, secondname, username, gender, email
  `;

  const values = [updateUserName, updateFirstName, updateSecondName, email];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating user data:", err);
      return res.status(500).json({ error: "Failed to update user details" });
    }

    res.json({ message: "User details updated successfully", user: result.rows[0] });
  });
});



// ✅ Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:3000/`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


module.exports = app;

