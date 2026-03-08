import express from 'express';
import {
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/', getAllAttendance);
router.get('/student/:student_id', getAttendanceByStudent);
router.get('/date/:date', getAttendanceByDate);
router.post('/', createAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router