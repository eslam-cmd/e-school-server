import express from "express";
import {
  createPracticalQuiz,
  getPracticalQuiz,
  updatePracticalQuiz,
  deletePracticalQuiz,
  getPracticalQuizzes
} from "../controllers/practicalQuizController.js";

const router = express.Router();

router.post("/", createPracticalQuiz);
router.get("/", getPracticalQuiz);  
router.put("/:id", updatePracticalQuiz); 
router.delete("/:id", deletePracticalQuiz);
router.get("/quiz", getPracticalQuizzes);  
export default router;