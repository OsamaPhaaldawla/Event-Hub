import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "alsunna500",
  database: "event_management",
});

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS for frontend access
// const query = "SELECT * FROM events";

// db.query(query, [eventId], (err, results) => {
//     if (err) {
//         return res.status(500).json({ error: err.message });
//     }
// });

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Example Route: Fetch all events
app.get("/events", (req, res) => {
  const query = "SELECT * FROM events";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port $", { PORT });
});

app.get("/events/:id", (req, res) => {
  const eventId = req.params.id;
  const query = "SELECT * FROM events WHERE id = ?";

  db.query(query, [eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(results[0]); // Return first matching event
  });
});
