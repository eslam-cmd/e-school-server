import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // 1. إعداد الناقل (Transporter) - هنا نستخدم Gmail كمثال
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // إيميلك الذي سيرسل الإشعارات
        pass: process.env.EMAIL_PASS, // كلمة سر التطبيقات (App Password)
      },
    });

    // 2. تفاصيل الرسالة
    const mailOptions = {
      from: `"The Institute's System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // 3. إرسال البريد
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 The notification was sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    // نرجع false حتى لا يتوقف تسجيل الدخول في حال فشل السيرفر في إرسال الإيميل
    return false;
  }
};
