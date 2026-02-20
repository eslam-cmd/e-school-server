// controllers/authController.js
import { pool } from "../config/db.js";

export async function login(req, res) {
  const { student_id } = req.body;

  try {
    const query = `
      SELECT student_id, name, specialization
      FROM students
      WHERE student_id = $1
      LIMIT 1
    `;
    const { rows } = await pool.query(query, [student_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "المعرف غير صحيح" });
    }

    return res.json({ message: "تم تسجيل الدخول", student: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}