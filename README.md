# 📚 Smart Library Management System (SLMS)

A complete, production-ready **Smart Library Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This is a BCA Final Year Major Project featuring user authentication, book management, borrowing system, fine calculation, and automated email notifications.

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
- Search books by title, author, or category
- Pagination support

### 📖 Borrowing System
- Issue books to members (14-day return window)
- Return books with automatic **fine calculation** (₹5/day overdue)
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

### 📊 Reports & Analytics
- Total books, users, borrows statistics
- Fine collection summary
- Most borrowed books list

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
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── bookModel.js
│   │   └── borrowModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowRoutes.js
│   │   └── userRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── catchAsyncErrors.js
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
│   │   │   ├── books/          # BookCard, BookList, BookForm
│   │   │   └── borrow/         # BorrowTable, BorrowCard
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, ManageBooks, ManageUsers, BorrowRecords, Reports
│   │   │   ├── member/         # MemberDashboard, MyBooks, Profile
│   │   │   └── (public pages)  # Home, Login, Register, etc.
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/         # authSlice, bookSlice, borrowSlice, userSlice
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
| POST | `/api/books` | Add new book | Admin |
| PUT | `/api/books/:id` | Update book | Admin |
| DELETE | `/api/books/:id` | Delete book | Admin |

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

---

## 📸 Screenshots

*(Screenshots can be added after running the application)*

- Home Page - Hero section with features
- Admin Dashboard - Statistics and recent activity
- Book Catalog - Grid view with search
- Member Dashboard - Borrow overview
- Book Management - Table with add/edit/delete

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