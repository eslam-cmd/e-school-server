import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const COOKIE_NAME = "studentAuthToken"; 

export async function trackStudentActivity(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded && decoded.id) {
        pool
          .query(`UPDATE students SET last_active_at = NOW() WHERE id = $1`, [
            decoded.id,
          ])
          .catch((err) => console.error("Activity track error:", err));
      }
    }
  } catch (err) {
  }
  next();
}
