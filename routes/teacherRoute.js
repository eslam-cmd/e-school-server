// server/routes/teacherRoutes.js
import express from "express";
import {
  loginTeacher,
  getTeacherProfile,
  updateTeacherProfile
} from "../controllers/teacherController.js";

const router = express.Router();

// تسجيل الدخول
router.post("/login", loginTeacher);

// جلب بروفايل المدرس المحمّل
router.get("/me", getTeacherProfile);

// تعديل الإيميل أو الباسورد
router.put("/update", updateTeacherProfile);

// تسجيل الخروج

export default router;