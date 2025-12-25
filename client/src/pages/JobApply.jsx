import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  FileText,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const JobApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/info/jobs/${id}/apply`, form);
      toast.success("Application Sent Successfully! 📧");
      navigate("/jobs");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#030407] text-slate-900 dark:text-white relative transition-colors duration-700">
      <Navbar />

      {/* --- 🌌 VIBRANT PARTICLE BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-indigo-500/30 dark:bg-indigo-400/20 rounded-full blur-xl animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(#80808015_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 h-full pt-28 pb-10 px-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-center">
        {/* ================= LEFT: DECORATIVE TEXT & BACK BUTTON ================= */}
        <div className="hidden md:flex flex-col w-1/2 space-y-8">
          {/* 🔙 CINEMATIC BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="group/back flex items-center gap-3 w-fit px-5 py-2.5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-sm transition-all hover:text-indigo-600 dark:hover:text-white hover:-rotate-2 hover:-translate-x-1 shadow-sm"
          >
            <ArrowLeft
              size={18}
              className="group-hover/back:-translate-x-1 transition-transform"
            />
            Back to Jobs
          </button>

          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
              <Sparkles size={14} /> Join the Squad
            </span>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.85]">
              Take the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 dark:from-indigo-400 dark:via-purple-400 dark:to-rose-400 animate-gradient-x">
                Next Step.
              </span>
            </h1>
            <p className="text-xl text-slate-800 dark:text-slate-200 font-semibold italic leading-relaxed">
              "Your career at BVC starts with a single click. Make it count."
            </p>
          </div>
        </div>

        {/* ================= RIGHT: GLOSSY FORM CARD ================= */}
        <div className="w-full md:w-1/2 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-40 dark:opacity-50" />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white/70 dark:bg-[#0a0a0f]/60 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/40 dark:border-white/10 shadow-2xl space-y-5"
          >
            {/* Mobile-only Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold mb-4"
            >
              <ArrowLeft size={18} /> Back
            </button>

            {[
              {
                name: "name",
                placeholder: "Full Name",
                icon: User,
                type: "text",
              },
              {
                name: "email",
                placeholder: "Email Address",
                icon: Mail,
                type: "email",
              },
              {
                name: "phone",
                placeholder: "Mobile Number",
                icon: Phone,
                type: "text",
              },
            ].map((input) => (
              <div key={input.name} className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 group-focus-within/input:text-indigo-600 dark:group-focus-within/input:text-indigo-400 transition-colors">
                  <input.icon size={18} />
                </div>
                <input
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  required
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold shadow-sm"
                />
              </div>
            ))}

            <label
              className={`relative flex items-center gap-4 w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all 
                ${
                  resumeName
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-slate-50/80 dark:bg-white/5 border-slate-300 dark:border-white/10 hover:border-indigo-500/50"
                }
            `}
            >
              <div
                className={`p-3 rounded-xl ${
                  resumeName
                    ? "bg-green-500 text-white"
                    : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                }`}
              >
                {resumeName ? (
                  <CheckCircle size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <span className="text-sm font-black truncate max-w-[200px] text-slate-800 dark:text-slate-200">
                {resumeName || "Upload Resume (PDF)"}
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <button
              disabled={loading}
              className="w-full py-4 rounded-2xl 
                         bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
                         text-white font-black uppercase tracking-widest text-sm 
                         flex items-center justify-center gap-3 
                         transition-all duration-300 
                         shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.6)]
                         active:scale-95 disabled:opacity-70"
            >
              {loading ? "Processing..." : "Submit Application"}
              <ArrowRight size={18} />
            </button>

            {/* Branded Bottom Text */}
            <div className="flex items-center justify-center gap-2 pt-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                Official BVC Careers
              </span>
            </div>
          </form>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        .animate-float { animation: float infinite ease-in-out; }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }
      `,
        }}
      />
    </div>
  );
};

export default JobApply;
