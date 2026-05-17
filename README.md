# 🧘 Yogshala — Yoga LMS Backend

Production-ready backend API for a Yoga Course Selling LMS Platform built with **Next.js 16**, **TypeScript**, **MongoDB Atlas**, **Auth.js v5**, and **Razorpay**.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.x | App Router, API Routes |
| TypeScript | 5.5+ | Type safety |
| MongoDB Atlas | Latest | Database |
| Mongoose | Latest | ODM |
| Auth.js (NextAuth) | v5 beta | Authentication |
| Razorpay | 2.9.x | Payment processing |
| Zod | 4.x | Validation |
| bcryptjs | 3.x | Password hashing |
| jose | Built-in | JWT tokens |

---

## 📁 Project Structure

```
src/
├── app/
│   └── api/
│       ├── auth/           # Auth endpoints
│       ├── courses/        # Course CRUD
│       ├── payments/       # Razorpay integration
│       ├── enrollments/    # Student enrollments
│       ├── classes/        # Class sessions
│       ├── admin/          # Admin endpoints
│       └── health/         # Health check
├── config/                 # Database, Auth, Razorpay configs
├── constants/              # Enums, constants
├── helpers/                # Error formatters
├── middleware/              # Auth, admin, validation middleware
├── models/                 # Mongoose schemas
├── repositories/           # Data access layer
├── services/               # Business logic layer
├── types/                  # TypeScript interfaces
├── utils/                  # Utility functions
├── validations/            # Zod schemas
└── proxy.ts                # Next.js 16 proxy (route protection)
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd yogshala-new
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=<from Google Cloud Console>
AUTH_GOOGLE_SECRET=<from Google Cloud Console>
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

### 3. Run Development Server

```bash
npm run dev
```

API is available at `http://localhost:3000/api`

### 4. Verify

```bash
curl http://localhost:3000/api/health
```

---

## 📡 API Endpoints

### Auth APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login with credentials |
| POST | `/api/auth/logout` | Required | Sign out |
| GET | `/api/auth/me` | Required | Get current user |
| POST | `/api/auth/complete-profile` | Required | Complete Google profile |
| POST | `/api/auth/change-password` | Required | Change password |
| POST | `/api/auth/forgot-password` | Public | Request reset token |
| POST | `/api/auth/reset-password` | Public | Reset with token |
| GET/POST | `/api/auth/[...nextauth]` | — | Auth.js handler |

### Course APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | Public | List courses (paginated) |
| POST | `/api/courses` | Admin | Create course |
| GET | `/api/courses/:id` | Public | Get course details |
| PUT | `/api/courses/:id` | Admin | Update course |
| DELETE | `/api/courses/:id` | Admin | Delete course |

### Payment APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-order` | Required | Create Razorpay order |
| POST | `/api/payments/verify` | Required | Verify payment |
| POST | `/api/payments/webhook` | Webhook | Razorpay webhook |

### Enrollment APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/enrollments/my-courses` | Required | My enrolled courses |
| GET | `/api/enrollments/:id` | Required | Enrollment details |

### Class Session APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/classes` | Admin | Create class session |
| PUT | `/api/classes/:id` | Admin | Update class session |
| DELETE | `/api/classes/:id` | Admin | Delete class session |
| GET | `/api/classes/course/:courseId` | Required | Get course classes |

### Admin APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/payments` | Admin | List all payments |
| GET | `/api/admin/enrollments` | Admin | List all enrollments |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |

---

## 📋 Sample Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jatin Sharma",
    "email": "jatin@example.com",
    "phone": "+919876543210",
    "password": "Secure@123",
    "gender": "male"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "6821a1b2c3d4e5f6a7b8c9d0",
      "name": "Jatin Sharma",
      "email": "jatin@example.com",
      "phone": "+919876543210",
      "role": "student",
      "profileCompleted": true
    }
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jatin@example.com",
    "password": "Secure@123"
  }'
```

### Create Course (Admin)

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{
    "title": "Beginner Yoga - Morning Batch",
    "description": "A complete 3-month yoga program for beginners focusing on flexibility, strength, and mindfulness.",
    "price": 4999,
    "durationInMonths": 3,
    "batchType": "morning",
    "startDate": "2026-06-01",
    "endDate": "2026-08-31",
    "totalClasses": 72,
    "instructorName": "Guru Prakash",
    "meetingPlatform": "zoom",
    "isPublished": true
  }'
```

### List Courses (with filters)

```bash
curl "http://localhost:3000/api/courses?page=1&limit=10&batchType=morning&search=yoga&sortBy=price&sortOrder=asc"
```

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Create Payment Order

```bash
curl -X POST http://localhost:3000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{ "courseId": "6821a1b2c3d4e5f6a7b8c9d0" }'
```

### Verify Payment

```bash
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{
    "razorpayOrderId": "order_xxxxx",
    "razorpayPaymentId": "pay_xxxxx",
    "razorpaySignature": "signature_xxxxx"
  }'
```

---

## 🔒 Security Features

- **bcrypt** password hashing (12 salt rounds)
- **Password never returned** in API responses (`select: false`)
- **HMAC SHA-256** Razorpay signature verification
- **Auth.js v5** with JWT sessions (HTTP-only cookies)
- **Role-based access** (student vs admin)
- **Profile completeness gate** before payments
- **Input validation** on every endpoint via Zod 4
- **Email enumeration prevention** on forgot-password

---

## 🏗 Architecture

```
Request → proxy.ts (route protection) → API Route → Middleware → Service → Repository → MongoDB
```

- **proxy.ts**: Lightweight route protection (Next.js 16)
- **Middleware**: Auth/admin checks, Zod validation
- **Services**: Business logic, orchestration
- **Repositories**: Data access, queries, lean operations
- **Models**: Mongoose schemas with indexes and methods

---

## 🚢 Deployment (Vercel + MongoDB Atlas)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js
5. Set up Razorpay webhook URL: `https://your-domain.com/api/payments/webhook`

---

## 📦 Dependencies

```json
{
  "mongoose": "latest",
  "next-auth": "beta",
  "@auth/mongodb-adapter": "latest",
  "bcryptjs": "^3.0.0",
  "razorpay": "^2.9.0",
  "zod": "^4.0.0",
  "uuid": "latest"
}
```

---

## 📄 License

MIT
