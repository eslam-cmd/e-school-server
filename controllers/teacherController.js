import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { pool } from "../config/db.js";

const Cookies = "authToken";
const isProd = process.env.NODE_ENV === "production";

// خصائص الكوكي المحمية والمهيأة محلياً وللإنتاج
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax", // متوافقة مع الـ localhost والتطوير المحلي
  maxAge: 2 * 60 * 60 * 1000, // ساعتان
  path: "/",
};

// إعداد مرسل الإيميلات باستخدام Gmail (تأكد من ضبط متغيرات البيئة في .env)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. المرحلة الأولى: التحقق من الهوية وإرسال كود الـ OTP
export async function loginTeacher(req, res) {
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM teachers WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const match = await bcrypt.compare(password, teacher.password_hash);

    if (!match) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    // توليد كود OTP عشوائي من 6 أرقام
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // صالح لـ 5 دقائق

    // حفظ كود الـ OTP وتاريخ الصلاحية في قاعدة البيانات
    const updateQuery = `
      UPDATE teachers 
      SET otp_code = $1, otp_expires = $2 
      WHERE id = $3
    `;
    await pool.query(updateQuery, [otp, otpExpires, teacher.id]);

    // إرسال كود الـ OTP إلى بريد الأستاذ
    const mailOptions = {
      from: `"EduPlatform Security" <${process.env.EMAIL_USER}>`,
      to: teacher.email,
      subject: "كود التحقق الخاص بلوحة التحكم",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 500px; margin: auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #1976d2; text-align: center; margin-bottom: 20px;">نظام إدارة المعهد - دخول آمن</h2>
          <p style="font-size: 16px; color: #333;">أهلاً بك يا أستاذ،</p>
          <p style="font-size: 14px; color: #555; line-height: 1.6;">لقد طلبت تسجيل الدخول إلى لوحة التحكم الخاصة بك. يرجى استخدام رمز التحقق المؤقت التالي لإتمام العملية:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1976d2; border-radius: 8px; margin: 25px 0; border: 1px dashed #1976d2;">
            ${otp}
          </div>
          <p style="color: #e53935; font-size: 12px; text-align: center; font-weight: bold;">هذا الكود صالح لمدة 5 دقائق فقط وسينتهي مفعوله بعدها.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #777; font-size: 11px; text-align: center;">إذا لم تقم بطلب تسجيل الدخول هذا، يرجى تغيير كلمة المرور فوراً لحماية حسابك.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      status: "OTP_SENT",
      message: "تم إرسال كود التحقق إلى بريدك الإلكتروني بنجاح",
    });
  } catch (error) {
    console.error("❌ خطأ تسجيل الدخول وإرسال الـ OTP:", error); // لمراقبة الـ Database Timeout
    return res
      .status(500)
      .json({
        error: "خطأ في السيرفر أثناء معالجة الطلب",
        details: error.message,
      });
  }
}

// 2. المرحلة الثانية: تأكيد كود الـ OTP وتوليد الجلسة والكوكيز
export async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const query = `SELECT * FROM teachers WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    // التحقق من وجود الكود وتطابقه وصلاحية الوقت
    if (
      !teacher.otp_code ||
      teacher.otp_code !== otp ||
      new Date() > new Date(teacher.otp_expires)
    ) {
      return res
        .status(400)
        .json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" });
    }

    // تصفير الكود في الداتابيز بعد التحقق بنجاح لمنع استخدامه مرة أخرى
    const clearOtpQuery = `
      UPDATE teachers 
      SET otp_code = NULL, otp_expires = NULL 
      WHERE id = $1
    `;
    await pool.query(clearOtpQuery, [teacher.id]);

    // توليد توكن الـ JWT
    const token = jwt.sign(
      {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.cookie(Cookies, token, COOKIE_OPTIONS);

    return res.json({
      message: "تم تسجيل الدخول بنجاح",
      id: teacher.id,
      name: teacher.name,
    });
  } catch (error) {
    console.error("❌ خطأ أثناء التحقق من كود الـ OTP:", error);
    return res.status(500).json({ error: "خطأ في السيرفر أثناء معالجة الكود" });
  }
}

// تسجيل الخروج ومسح الكوكي
export async function logoutTeacher(req, res) {
  res.clearCookie(Cookies, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  return res.json({ message: "تم تسجيل الخروج بنجاح" });
}

// جلب البروفايل للتحقق من هوية المعلم (مهم لحماية الداشبورد)
export async function getTeacherProfile(req, res) {
  try {
    const query = `SELECT id, email, name FROM teachers WHERE id = $1`;
    const { rows } = await pool.query(query, [req.user.id]);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({
        error: "المستخدم غير موجود",
      });
    }

    return res.json(teacher);
  } catch (err) {
    console.error("❌ خطأ جلب البروفايل:", err);
    return res.status(500).json({
      error: "خطأ في السيرفر",
    });
  }
}

// تعديل البيانات
export async function updateTeacherProfile(req, res) {
  try {
    const { id: newId, name, email, password } = req.body;

    const query = `SELECT id FROM teachers LIMIT 1`;
    const { rows } = await pool.query(query);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({
        error: "لا يوجد أستاذ لتحديثه",
      });
    }

    let password_hash = null;

    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    let updateQuery = `
      UPDATE teachers
      SET id = $1,
          name = $2,
          email = $3,
          updated_at = $4`;
    let values = [newId, name, email, new Date().toISOString()];

    let paramIndex = 5;

    if (password_hash) {
      updateQuery += `, password_hash = $${paramIndex}`;
      values.push(password_hash);
      paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex}`;
    values.push(teacher.id);

    const { rowCount } = await pool.query(updateQuery, values);

    if (rowCount === 0) {
      return res.status(400).json({
        error: "فشل التحديث",
      });
    }

    return res.json({
      message: "✅ تم تحديث بيانات الأستاذ وتغيير الـ ID بنجاح",
      newId,
    });
  } catch (err) {
    console.error("❌ خطأ تحديث بروفايل المعلم:", err);
    return res.status(500).json({
      error: "خطأ في السيرفر",
      details: err.message,
    });
  }
}
