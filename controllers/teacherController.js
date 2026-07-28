import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { transporter } from "../config/mailer.js";

const COOKIE_NAME = "authToken";
const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});
// 1️⃣ Login request and send OTP
export async function loginTeacher(req, res) {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM teachers WHERE email = $1`,
      [email],
    );
    const teacher = rows[0];

    if (!teacher || !(await bcrypt.compare(password, teacher.password_hash))) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ إعادة ضبط عداد المحاولات إلى 0 عند طلب رمز جديد
    await pool.query(
      `UPDATE teachers SET otp_code = $1, otp_expires = $2, otp_attempts = 0 WHERE id = $3`,
      [otpCode, otpExpires, teacher.id],
    );

    await transporter.sendMail({
      from: `"E-School Admin" <${process.env.EMAIL_USER}>`,
      to: teacher.email,
      subject: "Verification code for login",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; direction: ltr; text-align: left;">
          <h2>Hello ${teacher.name},</h2>
          <p>Your verification code for login is:</p>
          <h1 style="color: #2563eb; letter-spacing: 4px;">${otpCode}</h1>
          <p>This code is valid for 10 minutes only.</p>
        </div>
      `,
    });

    return res.json({
      status: "OTP_SENT",
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      error: "Failed to send verification code. Check email settings.",
    });
  }
}

// 2️⃣ Verify OTP, issue authentication cookie, and restrict attempts
export async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM teachers WHERE email = $1`,
      [email],
    );
    const teacher = rows[0];

    if (!teacher) {
      return res.status(400).json({ error: "البريد الإلكتروني غير مسجل" });
    }

    // التحقق من تجاوز الحد الأقصى للمحاولات (مثلاً 5 محاولات)
    const currentAttempts = teacher.otp_attempts || 0;
    if (currentAttempts >= 5) {
      // إبطال الرمز حمايةً للحساب
      await pool.query(
        `UPDATE teachers SET otp_code = NULL, otp_expires = NULL, otp_attempts = 0 WHERE id = $1`,
        [teacher.id],
      );
      return res.status(403).json({
        error:
          "لقد تجاوزت الحد الأقصى للمحاولات. تم إبطال الرمز، يرجى طلب رمز جديد.",
      });
    }

    // التحقق من صلاحية الوقت
    if (new Date(teacher.otp_expires) < new Date()) {
      return res
        .status(400)
        .json({ error: "Verification code expired, please request a new one" });
    }

    // التحقق من صحة الرمز
    if (teacher.otp_code !== otp) {
      // ❌ زيادة عداد المحاولات الفاشلة بمقدار 1
      const newAttempts = currentAttempts + 1;
      const remainingAttempts = 5 - newAttempts;

      await pool.query(`UPDATE teachers SET otp_attempts = $1 WHERE id = $2`, [
        newAttempts,
        teacher.id,
      ]);

      return res.status(400).json({
        error: `رمز التحقق غير صحيح. متبقي لديك ${remainingAttempts} محاولات.`,
      });
    }

    // ✅ نجاح التحقق: تصفير الرموز والمحاولات
    await pool.query(
      `UPDATE teachers SET otp_code = NULL, otp_expires = NULL, otp_attempts = 0 WHERE id = $1`,
      [teacher.id],
    );

    const token = jwt.sign(
      {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
        role: "teacher",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    // 📧 إرسال إشعار بريدي لتنبيه الأستاذ بنجاح عملية تسجيل الدخول
    const loginTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Riyadh",
    });

    transporter
      .sendMail({
        from: `"E-School Admin" <${process.env.EMAIL_USER}>`,
        to: teacher.email,
        subject: "🔔 Security Alert: Successful login to your account",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; direction: ltr; text-align: left; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b;">Hello ${teacher.name} 👋</h2>
          <p style="color: #334155;">A successful login to your teacher dashboard was detected.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p><strong>Login time:</strong> ${loginTime}</p>
          <p style="color: #64748b; font-size: 13px; margin-top: 20px;">
            If you did not perform this action, please reset your password immediately and contact system support.
          </p>
        </div>
      `,
      })
      .catch((mailErr) =>
        console.error("Login Notification Email Error:", mailErr),
      );

    return res.json({
      message: "Verification and login successful",
      id: teacher.id,
      name: teacher.name,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

// 3️⃣ Request password reset
export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM teachers WHERE email = $1`,
      [email],
    );
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({ error: "Email not registered" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE teachers SET otp_code = $1, otp_expires = $2, otp_attempts = 0 WHERE id = $3`,
      [otpCode, otpExpires, teacher.id],
    );

    await transporter.sendMail({
      from: `"E-School Admin" <${process.env.EMAIL_USER}>`,
      to: teacher.email,
      subject: "Password reset verification code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; direction: ltr; text-align: left;">
          <h2>Password Reset Request</h2>
          <p>Your verification code to reset the password is:</p>
          <h1 style="color: #dc2626; letter-spacing: 4px;">${otpCode}</h1>
        </div>
      `,
    });

    return res.json({
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

// 4️⃣ Reset password
export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM teachers WHERE email = $1`,
      [email],
    );
    const teacher = rows[0];

    if (!teacher || teacher.otp_code !== otp) {
      return res.status(400).json({ error: "رمز التحقق غير صحيح" });
    }

    if (new Date(teacher.otp_expires) < new Date()) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE teachers SET password_hash = $1, otp_code = NULL, otp_expires = NULL, otp_attempts = 0 WHERE id = $2`,
      [password_hash, teacher.id],
    );

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

// 5️⃣ Get profile (internal authentication)
export async function getTeacherProfile(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ error: "غير مصرح، الكوكي مفقودة" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "جلسة غير صالحة أو منتهية" });
    }

    if (decoded.role !== "teacher") {
      return res.status(403).json({ error: "وصول غير مصرح به لهذا الدور" });
    }

    const teacherId = decoded.id;

    const { rows } = await pool.query(
      `SELECT id, email, name FROM teachers WHERE id = $1`,
      [teacherId],
    );
    const teacher = rows[0];

    if (!teacher) return res.status(404).json({ error: "User not found" });

    return res.json(teacher);
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// 6️⃣ Update profile (internal authentication)
export async function updateTeacherProfile(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ error: "غير مصرح، الكوكي مفقودة" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "جلسة غير صالحة أو منتهية" });
    }

    if (decoded.role !== "teacher") {
      return res.status(403).json({ error: "وصول غير مصرح به لهذا الدور" });
    }

    const teacherId = decoded.id;
    const { name, email, password } = req.body;

    let updateQuery = `UPDATE teachers SET name = $1, email = $2, updated_at = NOW()`;
    let values = [name, email];

    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      updateQuery += `, password_hash = $3 WHERE id = $4`;
      values.push(password_hash, teacherId);
    } else {
      updateQuery += ` WHERE id = $3`;
      values.push(teacherId);
    }

    await pool.query(updateQuery, values);
    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({ error: "Update failed" });
  }
}

// 7️⃣ Logout and clear cookie
export async function logoutTeacher(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Logout failed" });
  }
}
