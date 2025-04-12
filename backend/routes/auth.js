import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Admin setup endpoint
router.post("/setup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      `
      INSERT INTO users (email, password_hash, role, is_initial_admin)
      VALUES (?, ?, 'admin', TRUE)
    `,
      [email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (err) {
    console.error("Setup error:", err);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

// Login for all roles
router.post("/login", async (req, res) => {
  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      req.body.email,
    ]);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // First-time admin setup
    if (user.is_initial_admin) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });
      return res.json({ requiresSetup: true, token });
    }

    // Normal login
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password_hash
    );
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: user.role === "admin" ? "1d" : "7d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
