// controllers/studentController.js
import { pool } from "../config/db.js";

export async function getStudentData(req, res) {
  const { student_id } = req.params;

  try {
    const query = `
  SELECT 
  s.*,
  COALESCE(
    (SELECT json_agg(a) FROM attendance a WHERE a.student_id = s.student_id),
    '[]'
  ) AS attendance,
  COALESCE(
    (SELECT json_agg(n) FROM notes n WHERE n.student_id = s.student_id),
    '[]'
  ) AS notes,
  COALESCE(
    (SELECT json_agg(q) FROM quizzes q WHERE q.student_id = s.student_id),
    '[]'
  ) AS quizzes
FROM students s
WHERE s.student_id = $1
LIMIT 1;
`;

    const { rows } = await pool.query(query, [student_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

    return res.status(200).json({ student: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}