import express from "express";
import { getStudents, addStudent, deleteStudent,updateStudent } from "../controllers/studentsController.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.delete("/:student_id", deleteStudent);
router.put("/:student_id", updateStudent);



export default router;
