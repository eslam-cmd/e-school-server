import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// إضافة مذاكرة عملية
export const createPracticalNote = async (req, res) => {
  const {
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
  } = req.body;

  const payload = {
    id: uuidv4(),
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
    type: "practical"
  };

  try {
    const query = `
      INSERT INTO notes (id, student_id, sabject_title, sabject_name, sabject_date, sabject_grade, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      payload.id,
      payload.student_id,
      payload.sabject_title,
      payload.sabject_name,
      payload.sabject_date,
      payload.sabject_grade,
      payload.type
    ];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "✅ تم إضافة المذاكرة العملية بنجاح",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// عرض كل المذاكرات العملية
export const getPracticalNotes = async (req, res) => {
  try {
    const query = `
      SELECT * FROM notes
      WHERE type = 'practical'
      ORDER BY sabject_date DESC
    `;
    const { rows } = await pool.query(query);
    res.status(200).json({
      message: "✅ تم جلب المذاكرات العملية بنجاح",
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل مذاكرة عملية
export const updatePracticalNote = async (req, res) => {
  const { id } = req.params;
  const {
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
  } = req.body;

  try {
    const query = `
      UPDATE notes
      SET sabject_title = $1,
          sabject_name = $2,
          sabject_date = $3,
          sabject_grade = $4
      WHERE id = $5 AND type = 'practical'
      RETURNING *
    `;
    const values = [sabject_title, sabject_name, sabject_date, sabject_grade, id];
    const { rows } = await pool.query(query, values);

    res.status(200).json({
      message: "✏️ تم تعديل المذاكرة العملية بنجاح",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف مذاكرة عملية
export const deletePracticalNote = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM notes
      WHERE id = $1 AND type = 'practical'
    `;
    await pool.query(query, [id]);

    res.status(200).json({
      message: "🗑️ تم حذف المذاكرة العملية بنجاح"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب المواد العملية الفريدة
export const getPracticalSubjects = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT sabject_name
      FROM notes
      WHERE type = 'practical' AND sabject_name IS NOT NULL
    `;
    const { rows } = await pool.query(query);

    const uniqueSubjects = rows.map(r => r.sabject_name);

    res.status(200).json({
      message: "✅ تم جلب المواد العملية المدخلة بنجاح",
      subjects: uniqueSubjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};