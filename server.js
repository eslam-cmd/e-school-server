import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import studentRoutes from "./routes/studentsRoute.js";
import quizRoutes from "./routes/quizRoute.js";
import sabjectRoute from "./routes/sabjectRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import accountStudentRoute from "./routes/accountStudentRoute.js";
import teacherRoute from "./routes/teacherRoute.js";
import practicalNotesRoutes from "./routes/practicalNotesRoutes.js";
import practicalQuizRoutes from "./routes/practicalQuizRoute.js";

import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.set("trust proxy", 1);

// 1️⃣ قائمة النطاقات المسموحة
const allowedOrigins = [
  "http://localhost:3000",
  "https://e-school-client.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 2️⃣ إعدادات CORS الشاملة (تعالج GET, POST و Preflight تلقائياً وبأمان)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  }),
);

// 3️⃣ الميدل وير الأساسية
app.use(cookieParser());
app.use(express.json());

// 4️⃣ Rate Limiter (يطبق على كافة مسارات الـ API)
app.use("/api", generalLimiter);

// 5️⃣ المسارات (Routes)
// 🚨 الترتيب الجوهري: المسار المخصص للحساب أولاً لمنع التضارب مع /api/students/:id
app.use("/api/students/account", accountStudentRoute);
app.use("/api/students", studentRoutes);

app.use("/api/teacher", teacherRoute);
app.use("/api/quiz", quizRoutes);
app.use("/api/sabject", sabjectRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/practical-notes", practicalNotesRoutes);
app.use("/api/practical-quiz", practicalQuizRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("✅ السيرفر يعمل بنجاح");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
