import express from 'express';
import {
  getAllQuiz,
  getQuizByStudent,
  createQuiz,
  updateQuizByStudent,
  deleteQuizByStudent,
  deleteQuiz     
} from '../controllers/quizController.js';

const router = express.Router();
router.get('/', getAllQuiz);
router.get('/:student_id', getQuizByStudent);
router.post('/', createQuiz);
router.put('/:student_id', updateQuizByStudent);
router.delete('/student/:student_id', deleteQuizByStudent);


router.delete('/:id',deleteQuiz);

export default router;
