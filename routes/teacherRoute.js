import express from "express";
import {
  loginTeacher,
  verifyOTP, // استيراد دالة التحقق الجديدة
  logoutTeacher,
  getTeacherProfile,
  updateTeacherProfile,
} from "../controllers/teacherController.js";

import { verifyAuth } from "../middleware/authMidleware.js";

const router = express.Router();

// تسجيل الدخول والخروج والتحقق بخطوتين
router.post("/login", loginTeacher);
router.post("/verify-otp", verifyOTP); // مسار تأكيد كود الـ OTP الجديد
router.post("/logout", logoutTeacher);

// مسارات محمية بالـ verifyAuth
router.get("/me", verifyAuth, getTeacherProfile);
router.put("/update", verifyAuth, updateTeacherProfile);

export default router;
