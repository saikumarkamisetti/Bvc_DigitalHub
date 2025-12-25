import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  X,
  Save,
  Building2,
  DollarSign,
  Link as LinkIcon,
  Sparkles,
  AlertTriangle, // ✅ Added for delete modal
} from "lucide-react";
import { toast } from "react-toastify";
import adminAPI from "../../services/adminApi";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ NEW: Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);

  // Form State for Jobs
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    deadline: "",
    description: "",
    link: "",
  });

  // --- ✅ 1. FETCH JOBS FROM DB ---
  useEffect(() => {
    setIsLoading(true);
    adminAPI
      .get("/admin/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch jobs");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // --- HANDLERS ---
  const handleOpenModal = (jobToEdit = null) => {
    if (jobToEdit) {
      const dateStr = jobToEdit.deadline
        ? new Date(jobToEdit.deadline).toISOString().split("T")[0]
        : "";

      setFormData({
        title: jobToEdit.title,
        company: jobToEdit.company,
        location: jobToEdit.location,
        type: jobToEdit.type || "Full-time",
        salary: jobToEdit.salary || "",
        deadline: dateStr,
        description: jobToEdit.description,
        link: jobToEdit.link || "",
      });
      setIsEditingId(jobToEdit._id);
    } else {
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        deadline: "",
        description: "",
        link: "",
      });
      setIsEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info(isEditingId ? "Updating job..." : "Posting job...", {
      autoClose: 1000,
    });

    try {
      if (isEditingId) {
        await adminAPI.put(`/admin/jobs/${isEditingId}`, formData);
        toast.success("Job updated successfully! 🚀");
      } else {
        await adminAPI.post("/admin/jobs", formData);
        toast.success("Job posted successfully! 🎉");
      }

      const res = await adminAPI.get("/admin/jobs");
      setJobs(res.data);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed. Please check inputs.");
    }
  };

  // --- ✅ NEW: FANCY DELETE HANDLER ---
  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsDeletingLocal(true);
    try {
      await adminAPI.delete(`/admin/jobs/${jobToDelete._id}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      toast.success("Job posting removed.");
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete job");
    } finally {
      setIsDeletingLocal(false);
      setJobToDelete(null);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300 relative overflow-x-hidden">
      <AdminNavbar />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
        .scale-in-center { animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 -right-40 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 -left-40 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 tracking-tight flex items-center gap-4 mb-2">
              <Briefcase className="w-12 h-12 text-cyan-500" />
              Career Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium max-w-xl">
              Manage job listings, internships, and placement opportunities for
              students.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="group relative overflow-hidden rounded-2xl py-4 px-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              Post New Job
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"></div>
          </button>
        </div>

        {/* Toolbar */}
        <div className="sticky top-24 z-30 mb-10 p-2 rounded-[1.5rem] bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-cyan-500/5 animate-fade-in-up">
          <div className="relative group">
            <Search className="absolute left-5 top-4 w-6 h-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              placeholder="Search by role, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg placeholder-slate-400 outline-none focus:bg-white/50 dark:focus:bg-[#0d1117]/50 transition-all"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="flex justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={() => handleOpenModal(job)}
                onDelete={() => {
                  setJobToDelete(job);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500">
              No Jobs Posted
            </h3>
            <p className="text-slate-400">
              Create a new listing to get started.
            </p>
          </div>
        )}
      </main>

      {/* Modal for Create/Edit */}
      {showModal && (
        <JobModal
          isEditing={!!isEditingId}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* ✅ FANCY MODERN DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => !isDeletingLocal && setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0b0c15] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_80px_-20px_rgba(244,63,94,0.3)] overflow-hidden scale-in-center">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 blur-[60px] pointer-events-none" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20 animate-pulse">
                <AlertTriangle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight uppercase">
                Delete Listing?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  "{jobToDelete?.title}"
                </span>{" "}
                at{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {jobToDelete?.company}
                </span>
                ?
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  disabled={isDeletingLocal}
                  onClick={confirmDeleteJob}
                  className={`w-full py-4 rounded-2xl bg-rose-600 text-white font-bold transition-all hover:bg-rose-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 ${
                    isDeletingLocal ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeletingLocal ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {isDeletingLocal ? "Removing..." : "Yes, Delete Job"}
                </button>
                <button
                  disabled={isDeletingLocal}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENT: Job Card ================= */
const JobCard = ({ job, onEdit, onDelete }) => {
  const deadlineDate = job.deadline
    ? new Date(job.deadline).toLocaleDateString()
    : "No Deadline";

  const typeColors = {
    "Full-time":
      "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20",
    "Part-time":
      "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Internship:
      "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20",
    Contract:
      "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  return (
    <div className="group relative bg-white/60 dark:bg-[#161b22]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col h-full">
      <div className="h-40 relative overflow-hidden shrink-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-6 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
        <div className="flex justify-between items-start relative z-10">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <span
            className={`px-3 py-1 rounded-full backdrop-blur-md border text-xs font-bold uppercase tracking-wider ${
              typeColors[job.type] || typeColors["Full-time"]
            }`}
          >
            {job.type}
          </span>
        </div>
        <h3 className="text-white text-2xl font-black leading-tight truncate relative z-10 mt-auto">
          {job.company}
        </h3>
      </div>

      <div className="p-6 pt-8 flex flex-col flex-1 relative z-10 -mt-6 rounded-t-[2.5rem] bg-white/80 dark:bg-[#161b22]/95 backdrop-blur-xl border-t border-white/20 dark:border-white/5">
        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
          {job.title}
        </h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
            <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
            <DollarSign className="w-4 h-4 text-green-500 shrink-0" />
            <span className="truncate">{job.salary || "Not Disclosed"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 col-span-2 truncate">
            <Clock className="w-4 h-4 text-orange-500 shrink-0" />
            Deadline: {deadlineDate}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {job.description}
        </p>
        <div className="flex gap-2 pt-4 border-t border-slate-200/50 dark:border-white/10 relative z-30">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold transition-all hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:scale-[1.02] active:scale-95"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold transition-all hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:scale-[1.02] active:scale-95"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENT: Job Modal ================= */
const JobModal = ({ isEditing, formData, setFormData, onClose, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 flex justify-center pt-28 px-4">
      <div
        className="relative w-full max-w-2xl bg-white/80 dark:bg-[#161b22]/90 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/20 flex flex-col"
        style={{ maxHeight: "calc(100vh - 8rem)" }}
      >
        <div className="h-24 bg-gradient-to-r from-cyan-600 to-blue-600 relative shrink-0 flex items-center px-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            {isEditing ? (
              <Edit2 className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            {isEditing ? "Edit Job Posting" : "Create New Job"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="p-8 overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-6">
            <GlassInput
              label="Job Title / Role"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Software Engineer Intern"
              required
              icon={Briefcase}
            />
            <GlassInput
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              required
              icon={Building2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore (Hybrid)"
                required
                icon={MapPin}
              />
              <div className="group">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                  Job Type
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none transition-all"
                  >
                    <option value="Full-time" className="dark:bg-[#161b22]">
                      Full-time
                    </option>
                    <option value="Part-time" className="dark:bg-[#161b22]">
                      Part-time
                    </option>
                    <option value="Internship" className="dark:bg-[#161b22]">
                      Internship
                    </option>
                    <option value="Contract" className="dark:bg-[#161b22]">
                      Contract
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput
                label="Salary Range (Optional)"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹12LPA - ₹15LPA"
                icon={DollarSign}
              />
              <GlassInput
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                icon={Clock}
              />
            </div>
            <div className="group">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Key responsibilities..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none transition-all"
                required
              />
            </div>
            <GlassInput
              label="Application Link / Email"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="e.g. https://..."
              icon={LinkIcon}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-lg shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Save size={20} />
            {isEditing ? "Update Job Posting" : "Publish Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

const GlassInput = ({ label, icon: Icon, ...props }) => (
  <div className="group">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-500 transition-colors" />
      )}
      <input
        {...props}
        className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
          Icon ? "pl-12" : ""
        }`}
      />
    </div>
  </div>
);

export default Jobs;
