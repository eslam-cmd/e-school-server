import express from "express";
import {
  loginTeacher,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getTeacherProfile,
  updateTeacherProfile,
  logoutTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

// 🟢 مسارات الدخول واستعادة الحساب
router.post("/login", loginTeacher);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutTeacher);

// 🔒 مسارات الحساب الموثقة (التحقق أصبح داخلياً في الكنترولر)
router.get("/me", getTeacherProfile);
router.put("/update", updateTeacherProfile);

export default router;
