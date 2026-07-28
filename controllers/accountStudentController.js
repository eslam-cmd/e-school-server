import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const STUDENT_COOKIE = "studentAuthToken";

res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none', 
  maxAge: 24 * 60 * 60 * 1000 
});

// 1️⃣ تسجيل الدخول
export async function loginStudent(req, res) {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ message: "يرجى تقديم معرف الطالب" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT student_id, name, specialization FROM students WHERE student_id = $1 LIMIT 1`,
      [student_id.trim()],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "المعرف غير صحيح" });
    }

    const student = rows[0];

    const token = jwt.sign(
      { id: student.student_id, name: student.name, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // زرق الكوكي المشفرة
    res.cookie(STUDENT_COOKIE, token, COOKIE_OPTIONS);

    return res.json({
      message: "تم تسجيل الدخول بنجاح",
      student,
    });
  } catch (error) {
    console.error("Student login error:", error);
    return res.status(500).json({ message: "خطأ في السيرفر الداخلي" });
  }
}

// 2️⃣ جلب بيانات الطالب الموثق عبر الكوكي حصراً
export async function getStudentData(req, res) {
  try {
    const token = req.cookies?.[STUDENT_COOKIE];

    if (!token) {
      return res.status(401).json({ message: "غير مصرح، الكوكي مفقودة" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "جلسة غير صالحة أو منتهية" });
    }

    if (decoded.role !== "student") {
      return res.status(403).json({ message: "وصول غير مصرح به لهذا الدور" });
    }

    const { rows } = await pool.query(
      `SELECT 
        s.student_id,
        s.name,
        s.specialization,
        COALESCE((SELECT json_agg(a) FROM attendance a WHERE a.student_id = s.student_id), '[]') AS attendance,
        COALESCE((SELECT json_agg(n) FROM notes n WHERE n.student_id = s.student_id), '[]') AS notes,
        COALESCE((SELECT json_agg(q) FROM quizzes q WHERE q.student_id = s.student_id), '[]') AS quizzes
      FROM students s
      WHERE s.student_id = $1
      LIMIT 1;`,
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get Student Data Error:", error);
    return res.status(500).json({ message: "خطأ في السيرفر الداخلي" });
  }
}

// 3️⃣ تسجيل الخروج
export async function logoutStudent(req, res) {
  try {
    res.clearCookie(STUDENT_COOKIE, COOKIE_OPTIONS);
    return res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    console.error("Student logout error:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الخروج" });
  }
}
