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

//! Registeration Point Note: not working we work with another one below
// app.post("/auth/register", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [existingUser] = await pool.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );
//     if (existingUser.length > 0) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
//       [name, email, hashedPassword, role || "attendee"]
//     );

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

const jwt = require("jsonwebtoken");

// new Middleware
function authMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Expecting: "Bearer <token>"

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
  const connection = await pool.getConnection(); // ✅ Get connection from pool
  try {
    const { name, email, password, adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      connection.release();
      return res
        .status(403)
        .json({ message: "Not authorized to register admin" });
    }

    const [existing] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"]
    );

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const admin = rows[0];

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    connection.release(); // ✅ Don't forget to release!

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    connection.release();
    console.error("Admin registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER ENDPOINT (for hoster and user and vendors)
app.post("/register", async (req, res) => {
  const connection = await pool.getConnection(); // ✅ Get a connection from the pool

  try {
    const { name, email, password, role } = req.body;

    if (!["attendee", "hoster", "vendor"].includes(role)) {
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
      { userId: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    connection.release();

    res.status(201).json({
      message: "User registered",
      token,
    });
  } catch (err) {
    connection.release();
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
      { userId: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

// POST endpoint to create a new venue
app.post(
  "/venues",
  authMiddleware(["vendor"]),
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
          `INSERT INTO venues (name, location, url, capacity, description, price, owner_id, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name,
            location,
            url,
            capacity,
            description,
            price,
            req.user.userId,
            "pending",
          ]
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
          .json({ message: "Venue created and pending approval", venueId });
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

// PUT endpoint to update an existing venue //! not updated yet
app.put(
  "/venues/:venueId",
  authMiddleware(["vendor"]),
  upload.array("images"),
  async (req, res) => {
    const { venueId } = req.params;
    const {
      name,
      location,
      url,
      capacity,
      description,
      price,
      availableSlots,
    } = req.body;

    // Parse available slots if needed
    const slots =
      typeof availableSlots === "string"
        ? JSON.parse(availableSlots)
        : availableSlots;

    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Get current venue to ensure it exists
        const [existingVenues] = await connection.query(
          "SELECT * FROM venues WHERE id = ?",
          [venueId]
        );

        if (existingVenues.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Venue not found" });
        }

        // Update the venue info
        await connection.query(
          `UPDATE venues SET 
            name = ?, location = ?, url = ?, capacity = ?, 
            description = ?, price = ? 
          WHERE id = ?`,
          [name, location, url, capacity, description, price, venueId]
        );

        // Update available slots: delete old and insert new
        await connection.query(
          "DELETE FROM available_slots WHERE venue_id = ?",
          [venueId]
        );

        for (const slot of slots) {
          for (const time of slot.times) {
            await connection.query(
              "INSERT INTO available_slots (venue_id, date, time) VALUES (?, ?, ?)",
              [venueId, slot.date, time]
            );
          }
        }

        // If new images are uploaded, replace old ones
        if (req.files && req.files.length > 0) {
          // Delete old image records (you can also choose to delete old files if needed)
          await connection.query(
            "DELETE FROM venue_images WHERE venue_id = ?",
            [venueId]
          );

          for (const file of req.files) {
            await connection.query(
              "INSERT INTO venue_images (venue_id, image_path) VALUES (?, ?)",
              [venueId, file.filename]
            );
          }
        }

        await connection.commit();
        connection.release();

        res.status(200).json({ message: "Venue updated successfully" });
      } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
      }
    } catch (err) {
      console.error("Error updating venue:", err);
      res.status(500).json({ error: "Failed to update venue" });
    }
  }
);

// GET endpoint to retrieve all venues
app.get("/venues", async (req, res) => {
  try {
    // const [venues] = await pool.query("SELECT * FROM venues");
    const [venues] = await pool.query(
      "SELECT * FROM venues WHERE status = 'approved'"
    );

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

// GET /venues/pending
app.get("/venues/pending", authMiddleware(["admin"]), async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM venues WHERE status = 'pending'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending venues:", err);
    res.status(500).json({ error: "Failed to fetch pending venues." });
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
        venueId,
        date,
        time,
        price,
      } = req.body;

      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Insert event with image path
        const [eventResult] = await connection.query(
          `INSERT INTO events (
    title, subtitle, type, access_type, seats, price, description,
    image_path, venue_id, hoster_id, date, time
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            subtitle,
            type,
            accessType,
            seats,
            price ? parseFloat(price) : 0.0,
            description,
            req.file ? req.file.filename : null,
            venueId,
            req.user.userId,
            date,
            time,
          ]
        );
        const eventId = eventResult.insertId;

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

// PUT endpoint to update an existing event
app.put(
  "/events/:eventId",
  authMiddleware(["admin", "hoster"]),
  upload.single("image"),
  async (req, res) => {
    const { eventId } = req.params;
    let {
      title,
      subtitle,
      type,
      accessType,
      seats,
      price,
      description,
      venueId,
      date,
      time,
    } = req.body;
    date = date?.split("T")[0]; // Keep only the calendar date (YYYY-MM-DD)
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // 🔍 Get the current event first to check ownership + existing image
        const [existingRows] = await connection.query(
          `SELECT * FROM events WHERE id = ?`,
          [eventId]
        );

        if (existingRows.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Event not found" });
        }

        const existingEvent = existingRows[0];

        // 🔐 Check that the hoster owns this event (if not admin)
        if (
          req.user.role === "hoster" &&
          existingEvent.hoster_id !== req.user.userId
        ) {
          connection.release();
          return res
            .status(403)
            .json({ error: "You are not allowed to edit this event" });
        }

        // 🧠 Decide which image path to use
        const imagePath = req.file
          ? req.file.filename // New image
          : existingEvent.image_path; // Keep the old one

        // 🛠 Update the event
        await connection.query(
          `UPDATE events SET
            title = ?, subtitle = ?, type = ?, access_type = ?, seats = ?, price = ?,
            description = ?, image_path = ?, venue_id = ?, date = ?, time = ?
          WHERE id = ?`,
          [
            title,
            subtitle,
            type,
            accessType,
            seats,
            price ? parseFloat(price) : 0.0,
            description,
            imagePath,
            venueId,
            date,
            time,
            eventId,
          ]
        );

        await connection.commit();
        connection.release();

        res.status(200).json({ message: "Event updated successfully" });
      } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
      }
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ error: "Failed to update event" });
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
        v.name as venueName,
        v.location as venueLocation,
        DATE_FORMAT(e.date, '%Y-%m-%d') as date,
        TIME_FORMAT(e.time, "%H:%i") as time,
        e.image_path as image
      FROM events e
      JOIN venues v ON e.venue_id = v.id
      ORDER BY e.date, e.time
    `);

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      subtitle: event.subtitle,
      price: event.price,
      type: event.type,
      accessType: event.accessType,
      description: event.description,
      venueName: event.venueName,
      venueLocation: event.venueLocation,
      date: event.date,
      time: event.time,
      image: event.image
        ? `${req.protocol}://${req.get("host")}/uploads/${event.image}`
        : null,
    }));
    // events.date = date?.split("T")[0]; // Keep only the calendar date (YYYY-MM-DD)

    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET endpoint to retrieve a single event with all details
app.get("/events/:id", async (req, res) => {
  try {
    const [events] = await pool.query(
      `
      SELECT 
        e.id,
        e.title,
        e.subtitle,
        e.price,
        e.type,
        e.access_type as accessType,
        e.seats,
        e.description,
        e.image_path as image,
        v.id as venueId,
        v.name as venueName,
        v.location as venueLocation,
        v.capacity as venueCapacity,
        DATE_FORMAT(e.date, '%Y-%m-%d') as date,
        TIME_FORMAT(e.time, "%H:%i") as time,
        u.name as hosterName,
        u.email as hosterEmail,
        e.hoster_id as hosterId
      FROM events e
      JOIN venues v ON e.venue_id = v.id
      JOIN users u ON e.hoster_id = u.id
      WHERE e.id = ?
      `,
      [req.params.id]
    );

    if (events.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = events[0];

    event.image = event.image
      ? { url: `${req.protocol}://${req.get("host")}/uploads/${event.image}` }
      : null;

    event.venue = {
      id: event.venueId,
      name: event.venueName,
      location: event.venueLocation,
      capacity: event.venueCapacity,
    };

    event.hoster = {
      id: event.hosterId,
      name: event.hosterName,
      email: event.hosterEmail,
    };

    // Clean up extra fields if needed
    delete event.venueName;
    delete event.venueLocation;
    delete event.venueCapacity;
    delete event.hosterName;
    delete event.hosterEmail;
    delete event.venueId;

    res.json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

// GET endpoint to retrieve event for a specific hoster
app.get("/events/hoster/:id", authMiddleware(["hoster"]), async (req, res) => {
  const hosterId = req.params.id;

  try {
    const [events] = await pool.query(
      `
      SELECT 
        e.id,
        e.title,
        e.subtitle,
        e.price,
        e.type,
        e.description,
        e.access_type as accessType,
        v.name as venueName,
        v.location as venueLocation,
        DATE_FORMAT(e.date, '%Y-%m-%d') as date,
        TIME_FORMAT(e.time, "%H:%i") as time,
        e.image_path as image
      FROM events e
      JOIN venues v ON e.venue_id = v.id
      WHERE e.hoster_id = ?
      ORDER BY e.date, e.time
    `,
      [hosterId]
    );

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      subtitle: event.subtitle,
      price: event.price,
      type: event.type,
      accessType: event.accessType,
      description: event.description,
      venueName: event.venueName,
      venueLocation: event.venueLocation,
      date: event.date,
      time: event.time,
      image: event.image
        ? `${req.protocol}://${req.get("host")}/uploads/${event.image}`
        : null,
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching hoster events:", error);
    res.status(500).json({ error: "Failed to fetch hoster events" });
  }
});

// PATCH /venues/:id/status
app.patch("/venues/:id/status", authMiddleware(["admin"]), async (req, res) => {
  const venueId = req.params.id;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    await pool.query("UPDATE venues SET status = ? WHERE id = ?", [
      status,
      venueId,
    ]);
    res.json({ message: `Venue status updated to ${status}` });
  } catch (err) {
    console.error("Error updating venue status:", err);
    res.status(500).json({ error: "Failed to update venue status." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
