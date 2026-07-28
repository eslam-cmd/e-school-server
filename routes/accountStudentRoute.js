import express from "express";
import {
  loginStudent,
  getStudentData,
  logoutStudent,
} from "../controllers/accountStudentController.js";

const router = express.Router();

router.post("/login", loginStudent);
router.get("/me", getStudentData);
router.post("/logout", logoutStudent);

export default router;
