import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "usersData.db");
let db = null;
try {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
    console.log("Connected to the database and ensured users table exists.");
} catch (e) {
    console.log(`Database connection error: ${e.message}`);
}

const query = `SELECT * FROM users_credentials;`;
const userData = await db.get(query);

const usernameElement = document.getElementById("usernameDisplay");
usernameElement.textContent = userData.username;

console.log(userData.username);
