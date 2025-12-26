import { useState, useEffect } from "react"; // ✅ Import useEffect
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  LogIn,
  ArrowLeft,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  // ✅ AUTO-REDIRECT LOGIC: Checks for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      toast.success(res.data.message, {
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/home");
      }, 1800);
    } catch (error) {
      toast.error(error.response?.data?.message, {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/50 p-4 md:p-6 relative overflow-hidden transition-colors duration-500">
      {/* ================= UNIQUE DYNAMIC BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div
          className="absolute top-[-10%] left-[-20%] w-[700px] h-[700px] bg-gradient-to-r from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/30 dark:to-purple-600/30 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-r from-blue-400/30 to-cyan-400/30 dark:from-blue-600/30 dark:to-cyan-600/30 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDuration: "18s", animationDelay: "2s" }}
        />
      </div>

      {/* ================= THE "HYPER-GLASS" CARD ================= */}
      <div className="relative z-10 w-full max-w-4xl h-auto md:h-[600px] grid grid-cols-1 md:grid-cols-2 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl dark:shadow-[0_0_50px_-12px_rgb(79,70,229,0.3)] border border-white/40 dark:border-white/10 animate-fade-in-up group transition-all duration-500">
        {/* ================= BACK BUTTON ================= */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 md:top-6 md:left-6 z-[100] p-2.5 rounded-xl bg-white/50 dark:bg-white/5 text-slate-500 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 group/back shadow-sm border border-slate-200 dark:border-white/10 backdrop-blur-md active:scale-90"
          title="Back to Landing"
        >
          <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
        </button>

        {/* Glass Reflections */}
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-3xl z-0 pointer-events-none transition-colors duration-500"></div>

        {/* Left Panel - BRANDING (Visible only on Desktop) */}
        <div className="hidden md:flex flex-col justify-between p-10 pt-24 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-600 via-purple-700 to-slate-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>

          <svg
            className="absolute top-0 right-0 opacity-20 mix-blend-overlay w-64 h-64 text-white"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,80.8,-46.1C89.8,-33.1,94.8,-16.6,93.8,-0.6C92.8,15.4,85.8,30.8,76.4,44.3C67,57.8,55.2,69.4,41.5,77.7C27.8,86,12.2,91,-3.1,96.4C-18.4,101.8,-33.4,107.6,-46.6,101.9C-59.8,96.2,-71.2,79.1,-79.9,62.5C-88.6,45.9,-94.6,29.8,-96.3,13.4C-98,-3,-95.4,-19.7,-89.1,-35.1C-82.8,-50.5,-72.8,-64.6,-60.1,-72.7C-47.4,-80.8,-32,-82.9,-17.1,-85.3C-2.2,-87.7,12.2,-90.4,26.7,-85.7C41.2,-81,55.8,-68.9,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Sparkles className="w-4 h-4 text-indigo-100" />
              </div>
              <span className="font-bold text-white text-sm tracking-[0.2em] drop-shadow-lg uppercase">
                BVC HUB
              </span>
            </div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-purple-200 mb-4 leading-[1.1] drop-shadow-2xl">
              Welcome <br /> Back.
            </h2>
            <p className="text-indigo-100/80 text-sm leading-relaxed max-w-xs font-medium backdrop-blur-sm p-2 rounded-xl border border-white/5 bg-white/5">
              Login to access your dashboard, track placements, and connect with
              faculty.
            </p>
          </div>

          <div className="relative z-10 inline-flex p-4 bg-gradient-to-r from-white/10 to-indigo-500/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg text-white">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Secure Portal</h4>
                <p className="text-indigo-200 text-[10px] tracking-wider uppercase">
                  Student Access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative z-10 bg-white/40 dark:bg-[#0d1117]/40 transition-colors duration-500 pt-24 md:pt-12 pb-16 md:pb-12">
          {/* ================= MOBILE BRANDING HEADER ================= */}
          <div className="flex md:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-sm tracking-[0.2em] uppercase">
              BVC HUB
            </span>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">
              Log In
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-300" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#13171d]/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1f2e] outline-none transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 active:scale-[0.99]"
              />
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-300" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#13171d]/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1a1f2e] outline-none transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 active:scale-[0.99]"
              />
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white rounded-2xl font-black text-sm tracking-widest shadow-[0_5px_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_5px_30px_-5px_rgba(99,102,241,0.6)] transition-all duration-500 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 overflow-hidden group/btn active:scale-95 uppercase"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Log In{" "}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Added mt-10 and uppercase for a cleaner, bolder look on mobile */}
          <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-10 font-bold uppercase tracking-widest">
            New to the platform?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 dark:text-indigo-400 font-black hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
