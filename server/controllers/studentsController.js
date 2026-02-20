import { pool } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

// استدعاء طلاب
export const getStudents = async (req, res) => {
  try {
    const query = `
      SELECT * FROM students 
      ORDER BY created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// اضافة طلاب
export const addStudent = async (req, res) => {
  try {
    const { 
      name,
      section,
      specialization, 
      phone,
      nameSchool,
      guardianNum 
    } = req.body;

    const query = `
      INSERT INTO students (name, section, specialization, phone, nameSchool, guardianNum)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [name, section, specialization, phone, nameSchool, guardianNum];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
export const updateStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    name,
    specialization,
    section,
    nameSchool,
    guardianNum,
    phone
  } = req.body;

  try {
    const query = `
      UPDATE students 
      SET name = $1, 
          specialization = $2, 
          section = $3, 
          nameSchool = $4, 
          guardianNum = $5, 
          phone = $6
      WHERE student_id = $7
      RETURNING *
    `;
    
    const values = [name, specialization, section, nameSchool, guardianNum, phone, student_id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: '❌ لم يتم العثور على الطالب' });
    }

    return res.status(200).json({
      message: '✅ تم تحديث بيانات الطالب بنجاح',
      data: rows[0]
    });
  } catch (error) {
    console.error("PostgreSQL update error:", error);
    return res.status(500).json({ message: error.message });
  }
};
// حذف الطلاب 
export const deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    const query = 'DELETE FROM students WHERE student_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [student_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '❌ لم يتم العثور على الطالب' });
    }

    res.status(200).json({ 
      message: "✅ تم حذف الطالب نهائيًا من القاعدة",
      deletedStudent: rows[0] 
    });
  } catch (err) {
    console.error("❌ خطأ في الحذف:", err.message);
    res.status(500).json({ error: "حدث خطأ أثناء الحذف" });
  }
};