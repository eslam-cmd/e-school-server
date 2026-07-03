import express from "express";
import {
  createPracticalNote,
  getPracticalNotes,
  updatePracticalNote,
  deletePracticalNote,
  getPracticalSubjects
} from "../controllers/practicalNotesController.js";

const router = express.Router();

router.post("/", createPracticalNote);       // إضافة
router.get("/", getPracticalNotes);          // عرض
router.put("/:id", updatePracticalNote);     // تعديل
router.delete("/:id", deletePracticalNote);  // حذف
router.get("/subjects", getPracticalSubjects);
export default router;