import express from 'express';
import {
  getAllNotes,
  getNoteByStudent,
  createNote,
  updateNoteByStudent,
  deleteNoteByStudent,
  deleteNote     
} from '../controllers/sabjectController.js';

const router = express.Router();

// GET /api/sabject/      → جميع الملاحظات
router.get('/', getAllNotes);

// GET /api/sabject/:student_id  → ملاحظات طالب واحد
router.get('/:student_id', getNoteByStudent);

// POST /api/sabject/     → إضافة ملاحظة جديدة
router.post('/', createNote);

// PUT /api/sabject/:student_id  → تعديل ملاحظات طالب
router.put('/:student_id', updateNoteByStudent);

// DELETE /api/sabject/:student_id → حذف/مسح ملاحظات طالب
router.delete('/student/:student_id', deleteNoteByStudent);


router.delete('/:id',deleteNote);

export default router;
