````markdown
# Student Administration — Backend API

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io)

Secure API server for the Student Administration System — built with Express 5 and PostgreSQL. Handles robust student/teacher authentication, OTP verification, data access, and protected dashboard operations.

> 🔗 Frontend repository: [e-school-client](https://github.com/eslam-cmd/e-school-client)

---

## ✨ Features

- **Dual Authentication System** — Role-based secure access for both Teachers and Students.
- **OTP & 2FA Security** — Time-limited email verification codes for teacher login and password recovery.
- **Brute-Force Protection** — Tracks failed OTP attempts and invalidates codes after threshold limits.
- **HttpOnly Cookies** — Secure token transmission and session management, safeguarding against XSS.
- **Parameterized Queries** — Absolute prevention of SQL injection across all PostgreSQL operations.
- **Rate Limiting** — Global request throttling using `express-rate-limit` to prevent API abuse.
- **Automated Testing** — Integration and security test suites powered by Jest and Supertest.

---

## 🛠 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Runtime        | Node.js / Express 5                         |
| Database       | PostgreSQL (`pg`) with Connection Pooling   |
| Authentication | JSON Web Tokens (`jsonwebtoken`) + Bcryptjs |
| Security       | Express Rate Limit & CORS                   |
| Mailing        | Nodemailer                                  |
| Testing        | Jest & Supertest                            |

---

## 🗺️ API Surface & Endpoints

### Student Authentication & Portal

- `POST /api/students/account/login` — Student login and JWT session cookie issuance
- `GET /api/students/account/me` — Authenticated student profile verification
- `POST /api/students/account/logout` — Clear student authentication session

### Teacher Authentication & Security

- `POST /api/teacher/login` — Teacher login request and OTP email dispatch
- `POST /api/teacher/verify-otp` — Teacher OTP validation and secure cookie issuance
- `POST /api/teacher/forgot-password` — Initiate password reset via email code
- `POST /api/teacher/reset-password` — Complete secure password update
- `GET /api/teacher/me` — Authenticated teacher profile retrieval
- `PUT /api/teacher/update` — Update teacher account settings
- `POST /api/teacher/logout` — Clear teacher session cookie

### Data Management Routes

- `GET /api/students` / `POST /api/students` / `PUT /api/students/:id` / `DELETE /api/students/:id` — Student records management
- `GET /api/attendance` / `POST /api/attendance` / `PUT /api/attendance/:id` / `DELETE /api/attendance/:id` — Attendance tracking operations
- `GET /api/quiz` / `POST /api/quiz` / `PUT /api/quiz/:student_id` / `DELETE /api/quiz/:id` — Quiz management & grading
- `GET /api/sabject` — Core subject data endpoints
- `GET /api/practical-notes` & `GET /api/practical-quiz` — Practical materials endpoints

---

## 🔄 Security & Hardening Architecture

- **JWT & Cookie Security:** Signed using `JWT_SECRET`, stored in `HttpOnly` cookies with `Secure` flags in production environments.
- **Database Safety:** Uses a managed connection pool (`pg.Pool`) and strict parameterized queries (`$1`, `$2`).
- **Input Cryptography:** Passwords hashed with `bcryptjs` utilizing optimal salt rounds.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL local instance or Cloud DB (e.g., Neon DB)

### Installation

```bash
# Clone repository
git clone [https://github.com/eslam-cmd/e-school-server.git](https://github.com/eslam-cmd/e-school-server.git)
cd e-school-server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```
````

### Environment Variables (`.env`)

```env
PORT=5001
NODE_ENV=development
PGHOST=localhost
PGDATABASE=eschool_db
PGUSER=postgres
PGPASSWORD=your_password
PGPORT=5432
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000

```

### Run

```bash
# Development mode (with auto-watch)
npm run dev

# Run automated integration tests
npm test

# Production build / start
npm run build
npm start

```

---

## 📁 Project Structure

```
server/
├── package.json
├── server.js
├── README.md
├── config/
│   ├── db.js
│   └── mailer.js
├── controllers/
│   ├── accountStudentController.js
│   ├── attendanceController.js
│   ├── practicalNotesController.js
│   ├── practicalQuizController.js
│   ├── quizController.js
│   ├── sabjectController.js
│   ├── studentsController.js
│   └── teacherController.js
├── middleware/
│   ├── authMidleware.js
│   └── rateLimiter.js
├── routes/
│   ├── accountStudentRoute.js
│   ├── attendanceRoute.js
│   ├── practicalNotesRoutes.js
│   ├── practicalQuizRoute.js
│   ├── quizRoute.js
│   ├── sabjectRoute.js
│   ├── studentsRoute.js
│   └── teacherRoute.js
├── tests/
│   └── teacherAuth.test.js
└── utils/
    └── sendEmail.js

```

---

## 📬 Contact

Built by **Islam Hadaya**

- Portfolio: [my-profile-personal-nextjs.vercel.app](https://my-profile-personal-nextjs.vercel.app)
- LinkedIn: [Islam Hadaya](https://www.linkedin.com/in/Islam-hadaya)
- Email: [hdayaaslam34@gmail.com](https://www.google.com/search?q=mailto%3Ahdayaaslam34%40gmail.com)

```

```
