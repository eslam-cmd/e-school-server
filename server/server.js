import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from './routes/studentsRoute.js';
import quizRoutes from './routes/quizRoute.js';
import sabjectRoute from './routes/sabjectRoute.js';
import attendanceRoute from './routes/attendanceRoute.js';
import authRouter from './routes/authRoute.js';
import accountStudentRoute from './routes/accountStudentRoute.js';
import teacherRoute from "./routes/teacherRoute.js";
import cookieParser from "cookie-parser"; 
import practicalNotesRoutes from "./routes/practicalNotesRoutes.js";
import practicalQuizRoutes from "./routes/practicalQuizRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin:["https://manager-students-client.vercel.app",
    "http://localhost:3000"] ,
    methods:["GET","POST", "PUT","DELETE"]
   
}));
// تسجيل مسارات الـ API
app.use('/api/students', studentRoutes);
// ---
app.use('/api/quiz', quizRoutes);
// ---
app.use('/api/sabject', sabjectRoute);
// --- 
app.use('/api/attendance', attendanceRoute);
// ---
app.use("/api/auth", authRouter);
app.use("/api/students/account", accountStudentRoute);

app.use("/api/teacher", teacherRoute);
app.use("/api/practical-notes", practicalNotesRoutes);
app.use("/api/practical-quiz", practicalQuizRoutes);


// نقطة الدخول للتأكد من عمل السيرفر
app.get("/", (req, res) => {
  res.send("✅ السيرفر يعمل بنجاح");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});