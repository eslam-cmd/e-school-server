import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';

// 1) إرجاع كل الملاحظات
export const getAllQuiz = async (req, res) => {
  try {
    const query = `
      SELECT * FROM quizzes 
      ORDER BY quiz_date DESC
    `;
    
    const { rows } = await pool.query(query);

    return res.status(200).json({
      message: '✅ تم جلب جميع الملاحظات بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL select all error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 2) إرجاع الملاحظات لطالب محدد (مصوّغة كمصفوفة)
export const getQuizByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      SELECT * FROM quizzes 
      WHERE student_id = $1
      ORDER BY quiz_date DESC
    `;
    
    const { rows } = await pool.query(query, [student_id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: '❌ لا توجد ملاحظات لهذا الطالب' });
    }

    return res.status(200).json({
      message: '✅ تم جلب الملاحظات بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL select by student error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 3) إضافة ملاحظة جديدة
export const createQuiz = async (req, res) => {
  const {
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade
  } = req.body;

  const id = uuidv4();

  try {
    const query = `
      INSERT INTO quizzes (id, student_id, quiz_title, quiz_name, quiz_date, quiz_grade)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [id, student_id, quiz_title, quiz_name, quiz_date, quiz_grade];
    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      message: '✅ تم إضافة الملاحظة بنجاح',
      data: rows[0]
    });
  } catch (error) {
    console.error("PostgreSQL insert error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 4) تعديل ملاحظة (أو ملاحظات) حسب student_id
export const updateQuizByStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade
  } = req.body;

  try {
    const query = `
      UPDATE quizzes 
      SET quiz_title = $1, 
          quiz_name = $2, 
          quiz_date = $3, 
          quiz_grade = $4
      WHERE student_id = $5
      RETURNING *
    `;
    
    const values = [quiz_title, quiz_name, quiz_date, quiz_grade, student_id];
    const { rows } = await pool.query(query, values);

    return res.status(200).json({
      message: '✅ تم تحديث الملاحظات بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL update error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 5) حذف/مسح ملاحظة حسب student_id
// حذف كل الكويزات الخاصة بطالب
export const deleteQuizByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      DELETE FROM quizzes 
      WHERE student_id = $1
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [student_id]);

    return res.status(200).json({
      message: '🗑 تم مسح ملاحظات الطالب بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL delete error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// حذف كويز واحد بالـ id
export const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM quizzes 
      WHERE id = $1
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [id]);

    return res.status(200).json({
      message: '🗑 تم حذف الملاحظة نهائياً بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL delete error:", error);
    return res.status(500).json({ message: error.message });
  }
};