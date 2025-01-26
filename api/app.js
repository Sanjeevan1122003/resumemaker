const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const dbPath = path.join(__dirname, "usersData.db");
let db = null;

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: true }));


const connectToDatabase = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running on https://resume-maker-sanjeevantech.vercel.app/");
        });
        console.log("Connected to the database and ensured users table exists.");
    } catch (e) {
        console.log(`Database connection error: ${e.message}`);
    }
};

connectToDatabase();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/signup/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/sign.html"));
});

app.get("/login/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.post("/api/signup/", async (req, res) => {
    const data = req.body;
    const { firstname, surname, username, gender, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users_credentials (firstname, surname, username, gender, email, password) VALUES
    (?, ? ,? ,?, ? ,?)`;
    const result = await db.run(query, [firstname, surname, username, gender, email, hashedPassword ]);
    res.send("Signup successful!");
})

app.post("/api/login/", async (req, res) => {
    const data = req.body;
    const { username, password } = data;
    const query = `SELECT * FROM users_credentials WHERE username = ?`;
    const result = await db.get(query, [username]);
    if (!result) {
        res.status(401).send("The username doesn't exist");
    } else {
        const isValidPassword = await bcrypt.compare(password, result.password);
        if (!isValidPassword) {
            res.status(401).send("Invalid password");
        } else {
            res.send("Login successful");
        }
    }
})


module.exports = app;



  
