import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export async function verifyAuth(req, res, next) {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: "غير مصرح" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    res.clearCookie("authToken", { path: "/" });

    return res.status(403).json({
      error: "توكن غير صالح أو منتهي الصلاحية",
    });
  }
}
