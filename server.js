import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import studentRoutes from "./routes/studentsRoute.js";
import quizRoutes from "./routes/quizRoute.js";
import sabjectRoute from "./routes/sabjectRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import authRouter from "./routes/authRoute.js";
import accountStudentRoute from "./routes/accountStudentRoute.js";
import teacherRoute from "./routes/teacherRoute.js";
import practicalNotesRoutes from "./routes/practicalNotesRoutes.js";
import practicalQuizRoutes from "./routes/practicalQuizRoute.js";

import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://e-school-client.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Rate Limit للـ API فقط
app.use("/api", generalLimiter);

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/sabject", sabjectRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/auth", authRouter);
app.use("/api/students/account", accountStudentRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/practical-notes", practicalNotesRoutes);
app.use("/api/practical-quiz", practicalQuizRoutes);
// Root
app.get("/", (req, res) => {
  res.send("✅ السيرفر يعمل بنجاح");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
