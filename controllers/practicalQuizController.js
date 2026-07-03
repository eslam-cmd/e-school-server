import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// إضافة مذاكرة عملية
export const createPracticalQuiz = async (req, res) => {
  const {
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade,
  } = req.body;

  const payload = {
    id: uuidv4(),
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade,
    type: "practical"
  };

  try {
    const query = `
      INSERT INTO quizzes (id, student_id, quiz_title, quiz_name, quiz_date, quiz_grade, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      payload.id,
      payload.student_id,
      payload.quiz_title,
      payload.quiz_name,
      payload.quiz_date,
      payload.quiz_grade,
      payload.type
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "✅ تم إضافة المذاكرة العملية بنجاح",
      data: rows[0]
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// عرض كل المذاكرات العملية
export const getPracticalQuiz = async (req, res) => {
  try {
    const query = `
      SELECT * FROM quizzes 
      WHERE type = $1 
      ORDER BY quiz_date DESC
    `;
    
    const { rows } = await pool.query(query, ["practical"]);

    res.status(200).json({
      message: "✅ تم جلب المذاكرات العملية بنجاح",
      data: rows
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// تعديل مذاكرة عملية
export const updatePracticalQuiz = async (req, res) => {
  const { id } = req.params;
  const {
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade,
  } = req.body;

  try {
    const query = `
      UPDATE quizzes 
      SET quiz_title = $1, 
          quiz_name = $2, 
          quiz_date = $3, 
          quiz_grade = $4
      WHERE id = $5 AND type = $6
      RETURNING *
    `;
    
    const values = [
      quiz_title,
      quiz_name,
      quiz_date,
      quiz_grade,
      id,
      "practical"
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على المذاكرة" });
    }

    res.status(200).json({
      message: "✏ تم تعديل المذاكرة العملية بنجاح",
      data: rows[0]
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// حذف مذاكرة عملية
export const deletePracticalQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM quizzes 
      WHERE id = $1 AND type = $2
    `;
    
    const { rowCount } = await pool.query(query, [id, "practical"]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "لم يتم العثور على المذاكرة" });
    }

    res.status(200).json({
      message: "🗑 تم حذف المذاكرة العملية بنجاح"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPracticalQuizzes = async (req, res) => {
  try {
    const query = `
      SELECT quiz_name FROM quizzes 
      WHERE type = $1 AND quiz_name IS NOT NULL
    `;
    
    const { rows } = await pool.query(query, ["practical"]);

    // إزالة التكرار
    const uniqueSubjects = [...new Set(rows.map(item => item.quiz_name).filter(Boolean))];

    res.json({ subjects: uniqueSubjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في جلب المواد العملية" });
  }
};