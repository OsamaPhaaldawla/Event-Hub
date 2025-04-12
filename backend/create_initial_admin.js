import bcrypt from "bcryptjs";
import db from "./db.js"; // Your DB connection

const tempPassword = Math.random().toString(36).slice(-12);
const hashedPassword = await bcrypt.hash(tempPassword, 12);

await db.query(
  `
  INSERT INTO users (email, password_hash, role, is_initial_admin)
  VALUES (?, ?, 'admin', TRUE)
`,
  ["admin@example.com", hashedPassword]
);

console.log(`Temporary Admin Credentials:
Email: admin@example.com
Password: ${tempPassword} 
!!! DESTROY THIS OUTPUT AFTER USE !!!`);
