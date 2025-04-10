/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
// const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
// const upload = require("multer")({ dest: "uploads/" });

// dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "alsunna500",
  database: "event_management",
});

/**
 * POST /api/venues
 * Create new venue
 */

// Configure multer to save images to the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; // Create a unique name for the file
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

// Endpoint to handle venue creation
app.post("/api/venues", upload.array("images"), (req, res) => {
  const { name, location, capacity, price, description, availableSlots } =
    req.body;
  const images = req.files; // Array of uploaded files

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  // Insert venue data into the database
  const sql = `INSERT INTO venues (name, location, capacity, price, description) VALUES (?, ?, ?, ?, ?)`;
  const values = [name, location, capacity, price, description];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Insert failed", details: err.message });
    }

    const venueId = result.insertId;

    // After the venue is created, insert images into a separate table (venue_images)
    images.forEach((image) => {
      const imagePath = `/uploads/${image.filename}`; // The path to the image

      const imageSql = `INSERT INTO venue_images (venue_id, image_path) VALUES (?, ?)`;
      db.query(imageSql, [venueId, imagePath], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Image insert failed", details: err.message });
        }
      });
    });

    res.status(201).json({
      message: "Venue created with images ✅",
      venueId,
    });
  });
});

app.get("/api/venues", (req, res) => {
  const sql = `SELECT v.id, v.name, v.location, v.capacity, v.price, v.description, vi.image_path
               FROM venues v
               LEFT JOIN venue_images vi ON vi.venue_id = v.id`;

  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching venues", details: err.message });
    }

    const venues = results.map((venue) => ({
      id: venue.id,
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      description: venue.description,
      imageUrl: `http://localhost:5000${venue.image_path}`, // Full URL to the image
    }));

    res.status(200).json(venues);
  });
});

// ********************************************************************************

//!!!!!!!!!! These is Wroking don't touch unliss the images uploading and sending
// const upload = multer({ dest: "uploads/" });
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.post("/api/venues", upload.array("images"), (req, res) => {
//   console.log(req.body);
//   try {
//     const { name, location, url, capacity, price, description } = req.body;

//     // ✅ Parse the stringified availableSlots
//     const availableSlots = JSON.parse(req.body.availableSlots);

//     // ✅ Handle files
//     const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

//     // ✅ Insert venue into DB (without images yet)
//     const sql = `
//       INSERT INTO venues (name, location, url, capacity, price, description)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     const values = [name, location, url, capacity, price, description];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ error: "Insert failed", details: err.message });
//       }

//       const venueId = result.insertId;

//       // ✅ Insert images
//       imagePaths.forEach((imagePath) => {
//         const imgSQL = `
//           INSERT INTO venue_images (venue_id, image_url)
//           VALUES (?, ?)
//         `;
//         db.query(imgSQL, [venueId, imagePath], (err) => {
//           if (err) {
//             console.error("Image insert failed:", err.message);
//           }
//         });
//       });

//       // ✅ Insert available slots
//       availableSlots.forEach((slot) => {
//         const slotSQL = `
//           INSERT INTO available_slots (venue_id, date, times)
//           VALUES (?, ?, ?)
//         `;
//         db.query(
//           slotSQL,
//           [venueId, slot.date, JSON.stringify(slot.times)],
//           (err) => {
//             if (err) {
//               console.error("Slot insert failed:", err.message);
//             }
//           }
//         );
//       });

//       res.status(201).json({
//         message: "Venue created ✅",
//         venueId,
//       });
//     });
//   } catch (err) {
//     console.error("Server error:", err.message);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// });

//? updating

// app.get("/api/venues", (req, res) => {
//   const sql = `
//     SELECT v.id, v.name, v.location, v.url, v.capacity, v.price, v.description,
//       (SELECT image_url FROM venue_images WHERE venue_id = v.id LIMIT 1) AS image
//     FROM venues v
//   `;

//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: "Failed to fetch venues" });

//     res.json(results);
//   });
// });

//   const sql = "SELECT * FROM venues";

//   db.query(sql, (err, results) => {
//     if (err)
//       return res.status(500).json({ error: "Fetch failed", details: err });

//     const formatted = results.map((venue) => ({
//       id: venue.id,
//       name: venue.name,
//       location: venue.location,
//       url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//         venue.location
//       )}`,
//       images: [
//         venue.image
//           ? `data:image/jpeg;base64,${venue.image.toString("base64")}`
//           : "/placeholder.jpg",
//       ],
//       capacity: venue.capacity,
//       price: venue.price,
//       description: venue.description,
//     }));

//     res.json(formatted);
//   });
// });

/**
 * GET /api/venues/:id
 * Fetch full venue details
 */
app.get("/api/venues/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM venues WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Fetch failed" });
    if (results.length === 0)
      return res.status(404).json({ message: "Venue not found" });

    const venue = results[0];
    venue.image = venue.image
      ? `data:image/jpeg;base64,${venue.image.toString("base64")}`
      : null;

    res.json(venue);
  });
});

/**
 * POST /api/events
 */
app.post("/api/events", upload.single("image"), (req, res) => {
  const {
    title,
    subtitle,
    date,
    location,
    event_type,
    description,
    access_type,
    seats,
    price,
  } = req.body;

  const imageBuffer = req.file ? req.file.buffer : null;

  const sql = `
    INSERT INTO events
    (title, subtitle, date, location, image, event_type, description, access_type, seats, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    title,
    subtitle,
    date,
    location,
    imageBuffer,
    event_type,
    description,
    access_type,
    seats,
    price,
  ];

  db.query(sql, values, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Insert failed", details: err });
    res
      .status(201)
      .json({ message: "Event created", eventId: result.insertId });
  });
});

/**
 * PUT /api/events/:id
 */
app.put("/api/events/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const {
    title,
    subtitle,
    date,
    location,
    event_type,
    description,
    access_type,
    seats,
    price,
  } = req.body;

  const imageBuffer = req.file ? req.file.buffer : null;

  let sql = `
    UPDATE events SET
    title = ?, subtitle = ?, date = ?, location = ?, event_type = ?,
    description = ?, access_type = ?, seats = ?, price = ?`;

  const values = [
    title,
    subtitle,
    date,
    location,
    event_type,
    description,
    access_type,
    seats,
    price,
  ];

  if (imageBuffer) {
    sql += `, image = ?`;
    values.push(imageBuffer);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err) => {
    if (err)
      return res.status(500).json({ error: "Update failed", details: err });
    res.json({ message: "Event updated" });
  });
});

/**
 * GET /api/events
 * (summary: id, title, date, location, image, access_type, description)
 */
app.get("/api/events", (req, res) => {
  const query = `
    SELECT id, title, subtitle, date, location, image, access_type, description 
    FROM events`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = results.map((event) => ({
      ...event,
      image: event.image ? event.image.toString("base64") : null,
    }));

    res.json(formatted);
  });
});

/**
 * GET /api/events/:id
 * (full event detail)
 */
app.get("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM events WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Fetch failed" });
    if (results.length === 0)
      return res.status(404).json({ message: "Event not found" });

    const event = results[0];
    if (event.image) {
      event.image = event.image.toString("base64");
    }

    res.json(event);
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
