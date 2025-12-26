import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowUpRight,
  Building2,
  Sparkles,
  Search,
  Zap,
  Filter,
} from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/info/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Failed to load jobs", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      [job.title, job.company, job.location, job.type]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    // Base: Slate-50 (Light) / Dark Navy #0B0C15 (Dark)
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0C15] text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* --- BACKGROUND GLOW & GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#23263a_1px,transparent_1px),linear-gradient(to_bottom,#23263a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Ambient Glows: Cyan & Blue for Professional/Tech vibe */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 dark:bg-cyan-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 px-6 pb-20">
        {/* ================= HEADER (Matches Reference Image) ================= */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            {/* Icon Box */}
            <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Briefcase size={32} strokeWidth={2.5} />
            </div>
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              Career{" "}
              <span className="text-cyan-500 dark:text-cyan-400">Portal</span>
            </h1>
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Manage job listings, internships, and placement opportunities for
            students.
            <span className="hidden md:inline">
              {" "}
              Find your next big break here.
            </span>
          </p>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="relative max-w-2xl mx-auto mb-20 group">
          {/* Glow behind search */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

          <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/80 dark:bg-[#13151f]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
            <Search
              size={22}
              className="text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, company, or location..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none text-lg font-medium"
            />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-500">
              <Filter size={12} /> Filter
            </div>
          </div>
        </div>

        {/* ================= JOB GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-[2.5rem] bg-slate-200 dark:bg-white/5 animate-pulse border border-transparent dark:border-white/5"
              ></div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

/* ================= GLOSSY JOB CARD ================= */
const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const deadlineDate = job.deadline
    ? new Date(job.deadline).toLocaleDateString()
    : "Open";

  // Dynamic Styles for Job Type
  const typeStyles = {
    "Full-time":
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    "Part-time":
      "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    Internship:
      "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
    Contract:
      "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  };

  return (
    <div
      // ✅ Added onClick and cursor-pointer to the main card container
      onClick={() => navigate(`/jobs/${job._id}/apply`)}
      className="group relative cursor-pointer bg-white dark:bg-[#181a25] rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 hover:border-cyan-500/30 overflow-hidden"
    >
      {/* Top Gradient Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Header: Icon & Type */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-[#202330] flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
              {job.company}
            </h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Posted Recently
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            typeStyles[job.type] || typeStyles["Full-time"]
          }`}
        >
          {job.type}
        </span>
      </div>

      {/* Main Content */}
      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-black mb-3 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
          {job.title}
        </h2>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold bg-slate-50 dark:bg-white/5 w-fit px-3 py-1.5 rounded-lg">
          <DollarSign size={16} className="text-emerald-500" />
          {job.salary || "Not Disclosed"}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
          <MapPin size={14} className="text-cyan-500" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
          <Clock size={14} className="text-orange-500" />
          <span className="truncate">Due: {deadlineDate}</span>
        </div>
      </div>

      {/* Footer & Button */}
      <div className="mt-auto relative z-10">
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
          {job.description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents double-triggering the parent div's onClick
            navigate(`/jobs/${job._id}/apply`);
          }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:bg-cyan-600 dark:hover:bg-cyan-400 dark:hover:text-white transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] group/btn"
        >
          Apply Now
          <ArrowUpRight
            size={18}
            className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

/* ================= EMPTY STATE ================= */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center opacity-80">
    <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-white/10">
      <Sparkles className="w-10 h-10 text-cyan-500" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
      No Openings Found
    </h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
      Try adjusting your search filters to find what you're looking for.
    </p>
  </div>
);

export default Jobs;
