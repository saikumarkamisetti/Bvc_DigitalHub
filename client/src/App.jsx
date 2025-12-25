import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import StaffDetails from "./pages/StaffDetails";
import EventDetails from "./pages/EventDetails";
import JobApply from "./pages/JobApply";

// Admin Pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminUsers from "./admin/pages/Users";
import AdminStaff from "./admin/pages/Staff";
import AdminEvents from "./admin/pages/Events";
import AdminJobs from "./admin/pages/Jobs";
import UserDetails from "./admin/pages/UserDetails";

/**
 * ✅ NEW: UniversalProtectedRoute
 * Allows access if either 'token' (User) or 'adminToken' (Admin) exists.
 * Otherwise, redirects to login.
 */
const UniversalProtectedRoute = ({ children }) => {
  const isUser = !!localStorage.getItem("token");
  const isAdmin = !!localStorage.getItem("adminToken");

  if (!isUser && !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // ✅ PERSISTENT THEME
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ✅ Apply theme and save preference
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <BrowserRouter>
      {/* 🌊 THEME LIQUID WRAPPER */}
      <div
        className={`theme-liquid-transition min-h-screen ${
          dark ? "dark bg-[#030407]" : "bg-slate-50"
        }`}
      >
        {/* 🌙 GLOBAL FANCY TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          className="fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full
                     bg-white/40 dark:bg-black/40 backdrop-blur-3xl
                     border border-white/40 dark:border-white/10
                     flex items-center justify-center text-2xl cursor-pointer
                     shadow-[0_20px_50px_rgba(0,0,0,0.1),_inset_0_0_15px_rgba(255,255,255,0.2)]
                     dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_0_15px_rgba(255,255,255,0.05)]
                     transition-all duration-1000 ease-in-out hover:scale-110 active:scale-90 group"
        >
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 group-hover:top-[-50%] group-hover:left-[-50%] transition-all duration-1000" />
          </div>

          <div
            className={`relative z-10 transition-all duration-[1200ms] ${
              dark ? "rotate-0 scale-100" : "rotate-[360deg] scale-110"
            }`}
          >
            {dark ? (
              <span className="drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
                ☀️
              </span>
            ) : (
              <span className="drop-shadow-[0_0_12px_rgba(129,140,248,0.8)]">
                🌙
              </span>
            )}
          </div>
        </button>

        <ToastContainer
          position="top-center"
          autoClose={1500}
          theme={dark ? "dark" : "light"}
        />

        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminProtectedRoute>
                <UserDetails />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <AdminProtectedRoute>
                <AdminStaff />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminProtectedRoute>
                <AdminEvents />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <AdminProtectedRoute>
                <AdminJobs />
              </AdminProtectedRoute>
            }
          />

          {/* ================= SHARED ACCESS (USER + ADMIN) ================= */}
          {/* 🚀 FIXED: Both Admins and Logged-in Users can see this page */}
          <Route
            path="/projects/:id"
            element={
              <UniversalProtectedRoute>
                <ProjectDetails />
              </UniversalProtectedRoute>
            }
          />

          {/* ================= USER ONLY PROTECTED ================= */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/edit/:id"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/:id"
            element={
              <ProtectedRoute>
                <StaffDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute>
                <JobApply />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
