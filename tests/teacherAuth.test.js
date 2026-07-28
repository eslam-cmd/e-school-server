import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import teacherRouter from "../routes/teacherRoute.js";
import { pool } from "../config/db.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/teacher", teacherRouter);

describe("🛡️ Teacher Module Integration & Security Tests", () => {
  const testEmail = "test_teacher_integration@school.com";

  afterAll(async () => {
    // إغلاق اتصالات الـ Pool لتجنب تحذيرات Jest المفتوحة
    await pool.end();
  });

  test("1. Should reject login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/teacher/login")
      .send({ email: testEmail, password: "WrongPassword123" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("2. Should lock/invalidate OTP after 5 consecutive failed verification attempts", async () => {
    for (let i = 1; i <= 6; i++) {
      const res = await request(app)
        .post("/api/teacher/verify-otp")
        .send({ email: testEmail, otp: "999999" });

      if (i <= 5) {
        expect(res.statusCode).toBe(400); // رمز خاطئ مع وجود محاولات متبقية
      } else {
        expect(res.statusCode).toBe(403); // قفل الحساب وإبطال الرمز بعد المحاولة الخامسة
      }
    }
  });

  test("3. Should block access to profile endpoint without valid auth cookie", async () => {
    const res = await request(app).get("/api/teacher/profile");
    expect(res.statusCode).toBe(401);
  });

  test("4. Should successfully logout and clear authentication session", async () => {
    const res = await request(app).post("/api/teacher/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out successfully");
  });
});