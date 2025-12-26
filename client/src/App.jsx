import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Components
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// Lazy Loaded Pages
const Landing = lazy(() => import("./pages/Landing"));
const Signup = lazy(() => import("./pages/Signup"));
const OTP = lazy(() => import("./pages/OTP"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Profile = lazy(() => import("./pages/Profile"));
const Staff = lazy(() => import("./pages/Staff"));
const Events = lazy(() => import("./pages/Events"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const EditProject = lazy(() => import("./pages/EditProject"));
const StaffDetails = lazy(() => import("./pages/StaffDetails"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const JobApply = lazy(() => import("./pages/JobApply"));

// Admin Pages
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./admin/pages/Users"));
const AdminStaff = lazy(() => import("./admin/pages/Staff"));
const AdminEvents = lazy(() => import("./admin/pages/Events"));
const AdminJobs = lazy(() => import("./admin/pages/Jobs"));
const UserDetails = lazy(() => import("./admin/pages/UserDetails"));

/**
 * ✅ GLOBAL LOADING COMPONENT
 */
const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/60 dark:bg-[#030407]/80 backdrop-blur-sm transition-all">
    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
    <p className="text-lg font-medium text-slate-600 dark:text-slate-300 animate-pulse">
      {message}
    </p>
  </div>
);

const UniversalProtectedRoute = ({ children }) => {
  const isUser = !!localStorage.getItem("token");
  const isAdmin = !!localStorage.getItem("adminToken");

  if (!isUser && !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [isProcessing, setIsProcessing] = useState(false);

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
      <div
        className={`theme-liquid-transition min-h-screen flex flex-col ${
          dark ? "dark bg-[#030407]" : "bg-slate-50"
        }`}
      >
        {isProcessing && <LoadingOverlay message="Processing request..." />}

        {/* 🌙 GLOBAL THEME TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          className="fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 flex items-center justify-center text-2xl cursor-pointer shadow-lg transition-all duration-1000 ease-in-out hover:scale-110 active:scale-90 group"
        >
          <div
            className={`relative z-10 transition-all duration-[1200ms] ${
              dark ? "rotate-0" : "rotate-[360deg]"
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

        <Suspense fallback={<LoadingOverlay message="Loading BVC Hub..." />}>
          {/* Main Content Area */}
          <div className="flex-grow">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/otp" element={<OTP />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* ADMIN ROUTES */}
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

              {/* SHARED PROTECTED ROUTES */}
              <Route
                path="/projects/:id"
                element={
                  <UniversalProtectedRoute>
                    <ProjectDetails />
                  </UniversalProtectedRoute>
                }
              />

              {/* USER PROTECTED ROUTES */}
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

          {/* FOOTER - Visible on all pages */}
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
