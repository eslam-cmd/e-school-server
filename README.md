# Student Management System - Back-End (Server & API) 🛡️

This is the core Back-End API and Database layer for the **Student Management System**. It provides a robust, secured, and high-performance server architecture responsible for data persistence, role-based authorization, and real-time synchronization between teacher administrative actions and student profiles.

---

## 🌐 Back-End API Live URL

The Back-End application is deployed on Vercel Serverless Functions and is accessible at:

```text
[https://e-school-server.vercel.app](https://e-school-server.vercel.app)

🔒 Advanced Server-Side Security Architecture

The system's most critical asset is its advanced security layer, designed to enforce strict access control and protect sensitive student data:

    Advanced CORS Protection: Cross-Origin Resource Sharing is strictly configured to allow requests only from trusted Client domains (e.g., your Front-End on localhost or production), preventing unauthorized Third-Party API access.

    Role-Based Authorization (RBAC): Authorization is enforced at the controller level. Attempting to Add or Update student data requires a valid Teacher token. Student tokens are restricted to read-only access for their personal data (ID) only.

    HTTPS Enforcement & Secure Tokens: All production traffic is strictly over HTTPS. JWT tokens used for authentication are signed with a strong, rotated secret key.

    Robust Input Validation: Strict validation schemas ensure that data entered by the teacher is clean, sanitized, and structurally correct before persistence.
