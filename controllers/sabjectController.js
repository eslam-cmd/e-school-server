import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';

// 1) إرجاع كل الملاحظات
export const getAllNotes = async (req, res) => {
  try {
    const query = `
      SELECT * FROM notes 
      WHERE type = $1 
      ORDER BY sabject_date DESC
    `;
    
    const { rows } = await pool.query(query, ['theory']);

    return res.status(200).json({
      message: '✅ تم جلب جميع الملاحظات النظرية بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL select all error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 2) إرجاع الملاحظات لطالب محدد (مصوّغة كمصفوفة)
export const getNoteByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      SELECT * FROM notes 
      WHERE student_id = $1 AND type = $2
      ORDER BY sabject_date DESC
    `;
    
    const { rows } = await pool.query(query, [student_id, 'theory']);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: '❌ لا توجد ملاحظات نظرية لهذا الطالب' });
    }

    return res.status(200).json({
      message: '✅ تم جلب الملاحظات النظرية بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL select by student error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 3) إضافة ملاحظة جديدة
export const createNote = async (req, res) => {
  const {
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade
  } = req.body;

  const id = uuidv4();

  try {
    const query = `
      INSERT INTO notes (id, student_id, sabject_title, sabject_name, sabject_date, sabject_grade, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [id, student_id, sabject_title, sabject_name, sabject_date, sabject_grade, 'theory'];
    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      message: '✅ تم إضافة الملاحظة النظرية بنجاح',
      data: rows[0]
    });
  } catch (error) {
    console.error("PostgreSQL insert error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 4) تعديل ملاحظة (أو ملاحظات) حسب student_id
export const updateNoteByStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade
  } = req.body;

  try {
    const query = `
      UPDATE notes 
      SET sabject_title = $1, 
          sabject_name = $2, 
          sabject_date = $3, 
          sabject_grade = $4
      WHERE student_id = $5 AND type = $6
      RETURNING *
    `;
    
    const values = [sabject_title, sabject_name, sabject_date, sabject_grade, student_id, 'theory'];
    const { rows } = await pool.query(query, values);

    return res.status(200).json({
      message: '✅ تم تحديث الملاحظات النظرية بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL update error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 5) حذف/مسح ملاحظة حسب student_id
export const deleteNoteByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      DELETE FROM notes 
      WHERE student_id = $1 AND type = $2
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [student_id, 'theory']);

    return res.status(200).json({
      message: '🗑 تم مسح ملاحظات الطالب النظرية بنجاح',
      data: rows
    });
  } catch (error) {
    console.error("PostgreSQL delete error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// حذف كويز واحد بالـ id
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM notes 
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