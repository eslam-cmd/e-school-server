// routes/studentRouter.js
import express from "express";
import { getStudentData } from "../controllers/accountStudentController.js";

const router = express.Router();

// GET /api/students/:student_id
router.get("/:student_id", getStudentData);

export default router;