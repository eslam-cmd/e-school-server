import express from "express";
import {
  loginTeacher,
  getTeacherProfile,
  updateTeacherProfile,
} from "../controllers/teacherController.js";

import { verifyAuth } from "../middleware/authMidleware.js";

const router = express.Router();

// تسجيل الدخول
router.post("/login", loginTeacher);

// محمية
router.get("/me", verifyAuth, getTeacherProfile);

// محمية
router.put("/update", verifyAuth, updateTeacherProfile);

export default router;
