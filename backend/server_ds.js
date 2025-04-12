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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

//? Routes Start from Here

const bcrypt = require("bcryptjs");

app.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "attendee"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

const jwt = require("jsonwebtoken");

function authMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey"
      );

      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

// REGISTER ENDPOINT (for admin only)
app.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json({ message: "Not authorized to register admin" });
    }

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"]
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER ENDPOINT (for hoster and user only) //? Chat Gpt
app.post("/register", async (req, res) => {
  const connection = await pool.getConnection(); // ✅ Get a connection from the pool

  try {
    const { name, email, password, role } = req.body;

    if (!["user", "hoster"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [existing] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      connection.release(); // ✅ Always release before return
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    connection.release(); // ✅ Release connection when done

    res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    connection.release(); // ✅ Ensure it's released even on error
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

// POST endpoint to create a new venue
app.post(
  "/venues",
  authMiddleware(["admin"]),
  upload.array("images"),
  async (req, res) => {
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

        res
          .status(201)
          .json({ message: "Venue created successfully", venueId });
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error("Error creating venue:", error);
      res.status(500).json({ error: "Failed to create venue" });
    }
  }
);

// GET endpoint to retrieve all venues
app.get("/venues", async (req, res) => {
  try {
    const [venues] = await pool.query("SELECT * FROM venues");

    for (const venue of venues) {
      const [slots] = await pool.query(
        `SELECT 
    DATE_FORMAT(date, '%Y-%m-%d') AS date, TIME_FORMAT(time, '%H:%i') AS time FROM available_slots WHERE venue_id = ? ORDER BY date, time`,
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

      // Get images
      const [images] = await pool.query(
        "SELECT image_path FROM venue_images WHERE venue_id = ?",
        [venue.id]
      );
      venue.images = images.map((img) => ({
        url: `${req.protocol}://${req.get("host")}/uploads/${img.image_path}`,
      }));
    }

    res.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ error: "Failed to fetch venues" });
  }
});

// GET endpoint for full venue details
app.get(
  "/venues/:id",
  authMiddleware(["admin", "hoster"]),
  async (req, res) => {
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
  }
);

// POST endpoint to create a new event with single image
app.post(
  "/events",
  authMiddleware(["admin", "hoster"]),
  upload.single("image"),
  async (req, res) => {
    console.log(req.body);
    try {
      const {
        title,
        subtitle,
        type,
        accessType,
        seats,
        description,
        venueName,
        date,
        time,
        price,
        hosterName,
        hosterEmail,
        hosterPassword,
        hosterDescription,
      } = req.body;

      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Insert event with image path
        const [eventResult] = await connection.query(
          `INSERT INTO events (
            title, subtitle, type, access_type, seats, price, description,
            image_path, venue_name, date, time
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            subtitle,
            type,
            accessType,
            seats,
            price ? parseFloat(price) : 0.0,
            description,
            req.file ? req.file.filename : null,
            venueName,
            date,
            time,
          ]
        );
        const eventId = eventResult.insertId;

        // Insert hoster information
        await connection.query(
          `INSERT INTO event_hosters (
            event_id, name, email, password, description
          ) VALUES (?, ?, ?, ?, ?)`,
          [eventId, hosterName, hosterEmail, hosterPassword, hosterDescription]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({
          message: "Event created successfully",
          eventId,
        });
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }
);

// GET endpoint to retrieve all events (simplified view)
app.get("/events", async (req, res) => {
  try {
    const [events] = await pool.query(`
        SELECT 
          e.id,
          e.title,
          e.subtitle,
          e.price,
          e.type,
          e.description,
          e.access_type as accessType,
          e.venue_name as venueName,
          e.date,
          TIME_FORMAT(e.time, "%H:%i") as time,
          e.image_path as image
        FROM events e
        ORDER BY e.date, e.time
      `);

    // Format the response with image URLs
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      subtitle: event.subtitle,
      price: event.price,
      type: event.type,
      accessType: event.accessType,
      description: event.description,
      venueName: event.venueName,
      date: event.date,
      time: event.time,
      image: event.image
        ? `${req.protocol}://${req.get("host")}/uploads/${event.image}`
        : null,
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET endpoint to retrieve a single event with all details
app.get("/events/:id", async (req, res) => {
  try {
    // Get basic event info
    const [events] = await pool.query(
      `
        SELECT 
          id,
          title,
          subtitle,
          price,
          type,
          access_type as accessType,
          seats,
          description,
          image_path as image,
          venue_name as venueName,
          date,
          TIME_FORMAT(time, "%H:%i") as time
        FROM events
        WHERE id = ?
      `,
      [req.params.id]
    );

    if (events.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = events[0];

    // Add full image URL if exists
    if (event.image) {
      event.image = {
        url: `${req.protocol}://${req.get("host")}/uploads/${event.image}`,
      };
    } else {
      event.image = null;
    }

    // Get hoster information
    const [hosters] = await pool.query(
      `SELECT 
          name as hosterName,
          email as hosterEmail,
          description as hosterDescription
         FROM event_hosters
         WHERE event_id = ?`,
      [event.id]
    );

    if (hosters.length > 0) {
      event.hoster = hosters[0];
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
