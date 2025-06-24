require("dotenv").config();
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const PORT = process.env.PORT || 1050;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Middleware to authenticate JWT token
const authenticate = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) return res.status(401).send("Invalid JWT Token");
    req.email = payload.email;
    next();
  });
};

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public/sign.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

app.use("/templates", express.static(path.join(__dirname, "templates")));

app.post("/usersignup", async (req, res) => {
  const { firstname, secondname, username, gender, email, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const { data: existingUser, error: fetchError } = await supabase
      .from("users_credentials")
      .select("*")
      .eq("email", email);

    if (fetchError) throw fetchError;

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists. Please log in." });
    }

    const { error: insertError } = await supabase
      .from("users_credentials")
      .insert([{ firstname, secondname, username, gender, email, password: hashedPassword }]);

    if (insertError) throw insertError;

    res.status(200).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed." });
  }
});

app.post("/userlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: userData, error } = await supabase
      .from("users_credentials")
      .select("*")
      .eq("email", email);

    if (error || userData.length === 0) {
      return res.status(404).json({ error: "Invalid login." });
    }

    const user = userData[0];
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    res.cookie("auth_token", token, { httpOnly: true, secure: false });
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

app.get("/dashboard", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/userdetails", authenticate, async (req, res) => {
  const email = req.email;
  try {
    const { data, error } = await supabase
      .from("users_credentials")
      .select("firstname, secondname, username, gender, email")
      .eq("email", email);

    if (error || data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: data[0] });
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.post("/resumedata", authenticate, async (req, res) => {
  const emailID = req.email;
  const {
    fullname, phone_number, job_role, email,
    school_name, school_marks, school_year, school_degree,
    intermediate_name, intermediate_degree, intermediate_course, intermediate_marks, intermediate_year,
    college_name, college_degree, college_course, college_marks, college_year,
    softSkills, technicalSkills, linkedin_Link, achievements, certificates, experiences, projects
  } = req.body;

  try {
    const { error } = await supabase
      .from("user_details")
      .insert([{
        emailid: emailID,
        fullname,
        phone_number,
        email,
        job_role,
        school_name,
        school_marks,
        school_year,
        school_degree,
        intermediate_name,
        intermediate_degree,
        intermediate_course,
        intermediate_marks,
        intermediate_year,
        college_name,
        college_degree,
        college_course,
        college_marks,
        college_year,
        softskills: softSkills,
        technicalskills: technicalSkills,
        linkedin_link: linkedin_Link,
        achievements: typeof achievements === "string" ? JSON.parse(achievements) : achievements,
        certificates: typeof certificates === "string" ? JSON.parse(certificates) : certificates,
        experiences: typeof experiences === "string" ? JSON.parse(experiences) : experiences,
        projects: typeof projects === "string" ? JSON.parse(projects) : projects
      }]);

    if (error) throw error;

    res.status(200).json({ message: "Form data saved successfully." });
  } catch (err) {
    console.error("Error saving form data:", err);
    res.status(500).json({ error: "Error saving form data." });
  }
});

app.get("/resumetemplates", authenticate, async (req, res) => {
  const email = req.email;
  try {
    const { data, error } = await supabase
      .from("user_details")
      .select("*")
      .eq("emailid", email)
      .order("id", { ascending: false });

    if (error || data.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("Fetch resume error:", err);
    res.status(500).json({ error: "Failed to load resume data" });
  }
});

app.post("/updateDetails", authenticate, async (req, res) => {
  const email = req.email;
  const { updateUserName, updateFirstName, updateSecondName } = req.body;

  if (!updateUserName || !updateFirstName || !updateSecondName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { data, error } = await supabase
      .from("users_credentials")
      .update({
        username: updateUserName,
        firstname: updateFirstName,
        secondname: updateSecondName
      })
      .eq("email", email)
      .select("firstname, secondname, username, gender, email");

    if (error || data.length === 0) {
      return res.status(500).json({ error: "Failed to update user details" });
    }

    res.json({ message: "User details updated successfully", user: data[0] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
