# 📚 Smart Library Management System (SLMS)

A complete, production-ready **Smart Library Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This is a BCA Final Year Major Project featuring user authentication, book management, borrowing system, fine calculation, automated email notifications, AI-powered book recommendations, QR code issue/return, community reviews & ratings, a waitlist system with auto-notifications, and a personal reading analytics dashboard.

---

## ✨ What's New — Advanced Features Added

The following 5 advanced features were recently added on top of the core system:

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🤖 **AI Recommendations** | Personalized book suggestions based on each member's borrow history and preferred categories |
| 2 | 📱 **QR Code Issue/Return** | Every book gets a unique QR code; members and admins can scan to instantly issue or return without manual ID entry |
| 3 | ⭐ **Book Reviews & Ratings** | Members who have returned a book can leave a star rating + comment; ratings are averaged and shown on every book card |
| 4 | 🔔 **Waitlist & Auto-Assignment** | Members join a position-tracked queue for unavailable books; the next person in line is auto-emailed the moment the book is returned |
| 5 | 📊 **Reading Analytics** | Personal dashboard with bar charts (books/month), category pie chart, on-time return rate, and reading streak |

---

## 📋 Features

### 🔐 Authentication
- User registration with **email OTP verification**
- **JWT-based** login with httpOnly cookies
- Forgot & Reset password via email link
- Role-based access control: **Admin** and **Member**

### 📚 Book Management (Admin)
- Add, edit, and delete books
- Upload book cover images via **Cloudinary**
- **QR code automatically generated** for every book on creation (stored as a data URL)
- Search books by title, author, or category
- Pagination support

### 📖 Borrowing System
- Issue books to members (14-day return window)
- Return books with automatic **fine calculation** (₹5/day overdue)
- **Issue or return books by scanning QR code** (no manual ID entry needed)
- Track all borrow/return history
- View overdue records

### 👥 User Management (Admin)
- View all registered users
- Promote/demote users between admin and member roles
- Delete users

### 📧 Email Notifications
- OTP verification email on registration
- Borrow confirmation email
- Return confirmation with fine details
- **Daily overdue reminder emails** (Cron job at 9 AM)
- **Automatic waitlist notification** when a reserved book becomes available

### 📊 Reports & Analytics
- Total books, users, borrows statistics
- Fine collection summary
- Most borrowed books list

### 🤖 AI Book Recommendations
- Content-based filtering using each member's borrow history
- Surfaces highly-rated available books from the member's preferred categories
- Falls back to top-rated books globally for new users with no history
- Embedded in the Member Dashboard as a "Recommended For You" section

### ⭐ Book Reviews & Community Ratings
- One review per user per book (enforced server-side)
- Gated to users who have an actual returned borrow record for the book
- Average rating and review count are denormalized on the Book document for fast reads
- Star ratings are displayed on every BookCard and the Book Detail page

### 🔔 Book Waitlist & Auto-Assignment
- Position-ordered queue per book
- Joining the waitlist is blocked when the book is available (direct borrow instead)
- On every book return, the **next person in the queue is automatically emailed**
- Members can view their queue position and leave the waitlist from My Books

### 📈 Personal Reading Analytics
- Books read per month — 12-month bar chart (Recharts)
- Category distribution — pie chart
- On-time return rate
- Recent reading activity table
- Accessible via **My Analytics** link in the member navigation

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React.js (Vite), Tailwind CSS, Redux Toolkit |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT, bcryptjs, Cookie-parser |
| **Email** | Nodemailer (Gmail SMTP) |
| **Image Upload** | Cloudinary, express-fileupload |
| **Scheduling** | node-cron |
| **State Management** | Redux Toolkit, React-Redux |
| **Routing** | React Router DOM v6 |
| **Notifications** | react-hot-toast |
| **QR Codes** | `qrcode` (backend generation), `qrcode.react` (frontend display) |
| **Charts** | Recharts (bar chart, pie chart) |

---

## 📁 Folder Structure

```
smart-library-management-system/
├── backend/
│   ├── config/
│   │   ├── config.env          # Environment variables
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js       # Includes QR code generation
│   │   ├── borrowController.js
│   │   ├── userController.js
│   │   ├── reviewController.js     # ★ NEW — Book reviews & ratings
│   │   ├── waitlistController.js   # ★ NEW — Waitlist queue management
│   │   ├── recommendationController.js  # ★ NEW — AI recommendations
│   │   └── analyticsController.js  # ★ NEW — Reading analytics
│   ├── models/
│   │   ├── userModel.js
│   │   ├── bookModel.js            # Updated: qrCode, averageRating, totalReviews fields
│   │   ├── borrowModel.js
│   │   ├── reviewModel.js          # ★ NEW
│   │   └── waitlistModel.js        # ★ NEW
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowRoutes.js
│   │   ├── userRoutes.js
│   │   ├── reviewRoutes.js         # ★ NEW
│   │   ├── waitlistRoutes.js       # ★ NEW
│   │   ├── recommendationRoutes.js # ★ NEW
│   │   └── analyticsRoutes.js      # ★ NEW
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── catchAsyncErrors.js
│   │   └── csrfMiddleware.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   ├── sendToken.js
│   │   ├── fineCalculator.js
│   │   ├── emailTemplates.js
│   │   └── sendVerificationCode.js
│   ├── services/
│   │   ├── notifyUsers.js
│   │   └── removeUnverifiedAccounts.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   │   ├── common/         # Loader, ProtectedRoute, DashboardCard
│   │   │   ├── books/
│   │   │   │   ├── BookCard.jsx    # Updated: star rating display, waitlist button
│   │   │   │   ├── BookList.jsx
│   │   │   │   ├── BookForm.jsx
│   │   │   │   ├── BookReviews.jsx     # ★ NEW — Review form + reviews list
│   │   │   │   ├── RecommendedBooks.jsx # ★ NEW — Recommendation carousel
│   │   │   │   └── QRScanner.jsx       # ★ NEW — Camera QR scanner modal
│   │   │   └── borrow/         # BorrowTable, BorrowCard
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, ManageBooks, ManageUsers, BorrowRecords, Reports
│   │   │   ├── member/
│   │   │   │   ├── MemberDashboard.jsx  # Updated: shows RecommendedBooks
│   │   │   │   ├── MyBooks.jsx          # Updated: shows waitlist queue position
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── ReadingAnalytics.jsx # ★ NEW — Charts & stats page
│   │   │   └── (public pages)  # Home, Login, Register, etc.
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── bookSlice.js
│   │   │       ├── borrowSlice.js
│   │   │       ├── userSlice.js
│   │   │       ├── reviewSlice.js         # ★ NEW
│   │   │       ├── waitlistSlice.js       # ★ NEW
│   │   │       ├── recommendationSlice.js # ★ NEW
│   │   │       └── analyticsSlice.js      # ★ NEW
│   │   └── utils/
│   │       └── api.js          # Axios instance
│   └── package.json
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)
- Gmail account with App Password enabled
- Cloudinary account (free tier works)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/KunalDev69/smart-library-management-system.git
cd smart-library-management-system
```

---

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `config/config.env` with your values:

```env
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/slms
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

The backend runs on: `http://localhost:4000`

---

### Step 3: Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

The frontend runs on: `http://localhost:5173`

---

### Step 4: Access the Application

Open your browser and go to: **http://localhost:5173**

**Default Admin Account** (create manually via MongoDB or promote a user):
- Register an account, then update the role to "admin" in MongoDB Atlas

---

## 🔑 Environment Variables Guide

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing (use a long random string) |
| `JWT_EXPIRE` | JWT expiry duration (e.g., `7d`) |
| `COOKIE_EXPIRE` | Cookie expiry in days (e.g., `7`) |
| `SMTP_MAIL` | Gmail address for sending emails |
| `SMTP_PASSWORD` | Gmail App Password (not your regular password) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FRONTEND_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |

**Gmail App Password Setup:**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords → Create a new app password
4. Use this password as `SMTP_PASSWORD`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/verify-otp` | Verify email OTP | Public |
| POST | `/api/auth/resend-otp` | Resend OTP | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/logout` | Logout | Private |
| POST | `/api/auth/forgot-password` | Send password reset email | Public |
| PUT | `/api/auth/reset-password/:token` | Reset password | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Books
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get all books (search + pagination) | Public |
| GET | `/api/books/:id` | Get single book | Public |
| POST | `/api/books` | Add new book (generates QR code) | Admin |
| PUT | `/api/books/:id` | Update book | Admin |
| DELETE | `/api/books/:id` | Delete book | Admin |
| PUT | `/api/books/:id/regenerate-qr` | Regenerate book QR code | Admin |

### Borrowing
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/borrow/issue` | Issue a book | Member |
| PUT | `/api/borrow/return/:id` | Return a book | Authenticated |
| GET | `/api/borrow/records` | Get all borrow records | Admin |
| GET | `/api/borrow/my-records` | Get my borrow records | Member |
| GET | `/api/borrow/overdue` | Get overdue records | Admin |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id/role` | Update user role | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Reviews ★ NEW
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/reviews/:bookId` | Add a review (must have returned book) | Member |
| GET | `/api/reviews/:bookId` | Get all reviews for a book | Public |
| GET | `/api/reviews/:bookId/can-review` | Check review eligibility | Authenticated |

### Waitlist ★ NEW
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/waitlist/:bookId` | Join the waitlist | Member |
| DELETE | `/api/waitlist/:bookId` | Leave the waitlist | Member |
| GET | `/api/waitlist/:bookId/position` | Get current queue position | Member |
| GET | `/api/waitlist/my-waitlist` | Get all waitlisted books | Member |

### Recommendations ★ NEW
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/recommendations` | Get personalized book recommendations | Authenticated |

### Analytics ★ NEW
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/analytics/my-stats` | Get personal reading analytics | Authenticated |
| GET | `/api/analytics/admin-summary` | Get admin-level analytics summary | Admin |

---

## 📸 Screenshots

*(Screenshots can be added after running the application)*

- Home Page - Hero section with features
- Admin Dashboard - Statistics and recent activity
- Book Catalog - Grid view with search, star ratings, and waitlist button
- Member Dashboard - Borrow overview with "Recommended For You" section
- Book Detail - Full review section with star rating input
- Book Management - Table with add/edit/delete and QR code display
- Reading Analytics - Bar chart, category pie chart, and reading stats

---

## 👥 Team Members

| Name | Enrollment Number |
|------|-------------------|
| **Aditya Pal** | 230302010307 |
| **Kunal Panchal** | 230302010367 |

**BCA Final Year Major Project**

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

This is an academic project. Feel free to fork it and build upon it for your own learning!