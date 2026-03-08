// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware للتحقق من توكن التوثيق المخزن في كوكيز باسم "authToken".
 * إذا كان التوكن صالحاً يُلحق بيانات المستخدم في req.user ويكمل الطلب،
 * وإلا يمسح الكوكي ويرد 401 أو 403.
 */
export async function verifyAuth(req, res, next) {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ error: "غير مصرح – الرجاء تسجيل الدخول" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (err) {
    res.clearCookie("authToken", { path: "/" });
    return res.status(403).json({ error: "توكن غير صالح أو منتهي الصلاحية" });
  }
}