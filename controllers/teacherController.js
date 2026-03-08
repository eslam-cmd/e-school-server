// server/controllers/teacherController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const COOKIE_NAME = "authToken";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
    path: "/",
};

// تسجيل دخول المدرّس (بدون تحقق مسبق)
export async function loginTeacher(req, res) {
  const { email, password } = req.body;
  
  try {
    const query = `
      SELECT * FROM teachers 
      WHERE email = $1
    `;
    
    const { rows } = await pool.query(query, [email]);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const match = await bcrypt.compare(password, teacher.password_hash);
    if (!match) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, name: teacher.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({
      message: "تم تسجيل الدخول بنجاح",
      id: teacher.id,
      name: teacher.name
    });
  } catch (error) {
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

// جلب بروفايل المدرّس (مع التحقق داخل الدالة)
export async function getTeacherProfile(req, res) {
  try {
    // 1) استخرج التوكن من الكوكيز
    const token = req.cookies[COOKIE_NAME];
    if (!token) throw new Error("غير مصرح");

    // 2) تحقق من التوكن
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // 3) أعد جلب بيانات أحدث من قاعدة البيانات
    const query = `
      SELECT id, email, name FROM teachers 
      WHERE id = $1
    `;
    
    const { rows } = await pool.query(query, [user.id]);
    const teacher = rows[0];

    if (!teacher) throw new Error("المستخدم غير موجود");

    return res.json(teacher);

  } catch (err) {
    // مسح الكوكيز إذا كان التوكن غير صالح
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res.status(401).json({ error: err.message });
  }
}

// تعديل الإيميل أو الباسورد مع تغيير الـ ID
export async function updateTeacherProfile(req, res) {
  try {
    const { id: newId, name, email, password } = req.body;

    // جلب أول أستاذ من الجدول
    const query = `
      SELECT id FROM teachers 
      LIMIT 1
    `;
    
    const { rows } = await pool.query(query);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({ error: "لا يوجد أستاذ لتحديثه" });
    }

    // تشفير كلمة المرور إذا تم إرسالها
    let password_hash = null;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    // تجهيز البيانات للتحديث
    const updates = {
      id: newId, // ✅ تغيير الـ ID
      name,
      email,
      updated_at: new Date().toISOString(),
    };

    if (password_hash) {
      updates.password_hash = password_hash;
    }

    // بناء استعلام التحديث الديناميكي
    let updateQuery = `
      UPDATE teachers 
      SET id = $1, name = $2, email = $3, updated_at = $4
    `;
    
    let values = [newId, name, email, new Date().toISOString()];
    let paramIndex = 5;

    if (password_hash) {
      updateQuery += `, password_hash = $${paramIndex}`;
      values.push(password_hash);
      paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex}`;
    values.push(teacher.id);

    // تنفيذ التحديث في PostgreSQL
    const { rowCount } = await pool.query(updateQuery, values);

    if (rowCount === 0) {
      return res.status(400).json({ error: "فشل التحديث" });
    }

    return res.json({
      message: "✅ تم تحديث بيانات الأستاذ وتغيير الـ ID بنجاح",
      newId
    });
  } catch (err) {
    return res.status(500).json({ error: "خطأ في السيرفر", details: err.message });
  }
}