/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Serve uploaded images statically
app.use("/uploads", express.static(process.env.UPLOAD_DIR));

// POST endpoint to create a new venue
app.post("/venues", upload.array("images"), async (req, res) => {
  try {
    const {
      name,
      location,
      url,
      capacity,
      description,
      price,
      availableSlots,
    } = req.body;

    // Parse availableSlots if it's a string
    const slots =
      typeof availableSlots === "string"
        ? JSON.parse(availableSlots)
        : availableSlots;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert venue
      const [venueResult] = await connection.query(
        "INSERT INTO venues (name, location, url, capacity, description, price) VALUES (?, ?, ?, ?, ?, ?)",
        [name, location, url, capacity, description, price]
      );
      const venueId = venueResult.insertId;

      // Insert available slots
      for (const slot of slots) {
        for (const time of slot.times) {
          await connection.query(
            "INSERT INTO available_slots (venue_id, date, time) VALUES (?, ?, ?)",
            [venueId, slot.date, time]
          );
        }
      }

      // Insert images
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await connection.query(
            "INSERT INTO venue_images (venue_id, image_path) VALUES (?, ?)",
            [venueId, file.filename]
          );
        }
      }

      await connection.commit();
      connection.release();

      res.status(201).json({ message: "Venue created successfully", venueId });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ error: "Failed to create venue" });
  }
});

// GET endpoint to retrieve all venues with limited data and first image only
app.get("/venues", async (req, res) => {
  try {
    // Select only the required fields from venues
    const [venues] = await pool.query(`
        SELECT 
          id, 
          name, 
          location, 
          url, 
          capacity, 
          description, 
          price 
        FROM venues
      `);

    for (const venue of venues) {
      // Get the first image only
      const [images] = await pool.query(
        `SELECT image_path 
           FROM venue_images 
           WHERE venue_id = ? 
           LIMIT 1`,
        [venue.id]
      );

      // Add image URL if exists
      if (images.length > 0) {
        venue.image = `${req.protocol}://${req.get("host")}/uploads/${
          images[0].image_path
        }`;
      } else {
        venue.image = null;
      }

      // Remove availableSlots since we don't need them in this view
      // If you need them later, you can add them back
    }

    res.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ error: "Failed to fetch venues" });
  }
});

// GET endpoint for full venue details
app.get("/venues/:id", async (req, res) => {
  try {
    const [venues] = await pool.query("SELECT * FROM venues WHERE id = ?", [
      req.params.id,
    ]);

    if (venues.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    const venue = venues[0];

    // Get available slots
    const [slots] = await pool.query(
      'SELECT date, TIME_FORMAT(time, "%H:%i") as time FROM available_slots WHERE venue_id = ? ORDER BY date, time',
      [venue.id]
    );

    // Group slots by date
    const groupedSlots = {};
    slots.forEach((slot) => {
      if (!groupedSlots[slot.date]) {
        groupedSlots[slot.date] = [];
      }
      groupedSlots[slot.date].push(slot.time);
    });

    venue.availableSlots = Object.keys(groupedSlots).map((date) => ({
      date,
      times: groupedSlots[date],
    }));

    // Get all images
    const [images] = await pool.query(
      "SELECT image_path FROM venue_images WHERE venue_id = ?",
      [venue.id]
    );
    venue.images = images.map((img) => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${img.image_path}`,
    }));

    res.json(venue);
  } catch (error) {
    console.error("Error fetching venue details:", error);
    res.status(500).json({ error: "Failed to fetch venue details" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
