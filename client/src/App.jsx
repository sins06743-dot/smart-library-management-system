import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

// Load user action
import { loadUser } from "./redux/slices/authSlice";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Route guard
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Catalog from "./pages/Catalog";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import BorrowRecords from "./pages/admin/BorrowRecords";
import Reports from "./pages/admin/Reports";

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard";
import MyBooks from "./pages/member/MyBooks";
import Profile from "./pages/member/Profile";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  // Load user on app start (checks if cookie is valid)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#1f2937", color: "#fff" },
          success: { iconTheme: { primary: "#4ade80", secondary: "#fff" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#fff" } },
        }}
      />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/catalog" element={<Catalog />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/books"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/borrow-records"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BorrowRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Member Protected Routes */}
            <Route
              path="/member/dashboard"
              element={
                <ProtectedRoute allowedRoles={["member"]}>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/my-books"
              element={
                <ProtectedRoute allowedRoles={["member"]}>
                  <MyBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/profile"
              element={
                <ProtectedRoute allowedRoles={["member", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="text-center py-24">
                  <h1 className="text-6xl font-bold text-indigo-600">404</h1>
                  <p className="text-gray-500 text-xl mt-4">Page not found</p>
                  <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                    Go Home
                  </a>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
