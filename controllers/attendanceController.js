import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';

// GET /api/attendance → كل سجلات التفقد
export const getAllAttendance = async (req, res) => {
  try {
    const query = `
      SELECT * FROM attendance
      ORDER BY attendance_date DESC
    `;
    const { rows } = await pool.query(query);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance/student/:student_id → سجلات طالب واحد
export const getAttendanceByStudent = async (req, res) => {
  const { student_id } = req.params;
  try {
    const query = `
      SELECT * FROM attendance
      WHERE student_id = $1
    `;
    const { rows } = await pool.query(query, [student_id]);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance/date/:date → سجلات يوم محدد
export const getAttendanceByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const query = `
      SELECT * FROM attendance
      WHERE attendance_date = $1
    `;
    const { rows } = await pool.query(query, [date]);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/attendance → إضافة سجل
export const createAttendance = async (req, res) => {
  const payload = { id: uuidv4(), ...req.body };
  try {
    const query = `
      INSERT INTO attendance (id, student_id, attendance_date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      payload.id,
      payload.student_id,
      payload.attendance_date,
      payload.status
    ];
    const { rows } = await pool.query(query, values);
    res.status(201).json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/attendance/:id → تعديل سجل
export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { student_id, attendance_date, status } = req.body;
  try {
    const query = `
      UPDATE attendance
      SET student_id = $1,
          attendance_date = $2,
          status = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [student_id, attendance_date, status, id];
    const { rows } = await pool.query(query, values);
    res.status(200).json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/attendance/:id → حذف سجل
export const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      DELETE FROM attendance
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};