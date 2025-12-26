import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  UploadCloud,
  GraduationCap,
  Briefcase,
  BookOpen,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

/* ================= CONSTANTS ================= */

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
const POSITIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "HOD",
];

/* ================= HELPERS ================= */

const normalizeSubjects = (subjects) => {
  if (!subjects) return [];
  if (Array.isArray(subjects)) return subjects;
  if (typeof subjects === "string")
    return subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

/* ================= MAIN COMPONENT ================= */

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");

  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);

  // ✅ New Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("adminToken");

  /* -------- FETCH -------- */
  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* -------- HANDLERS -------- */
  const handleAddClick = () => {
    setForm({});
    setFile(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (s) => {
    setEditingStaff(s);
    setForm({
      ...s,
      subjects: normalizeSubjects(s.subjects).join(", "),
    });
    setFile(null);
  };

  const addStaff = async () => {
    if (!form.name || !form.department || !form.position) {
      toast.error("Name, Department and Position are required");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("photo", file);

      await axios.post("http://localhost:5000/api/admin/staff", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Staff added successfully", { autoClose: 1500 });
      setIsAddModalOpen(false);
      fetchStaff();
    } catch (error) {
      toast.error("Failed to add staff");
    }
  };

  const updateStaff = async () => {
    if (!form.name || !form.department || !form.position) {
      toast.error("Name, Department and Position are required");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("photo", file);

      await axios.put(
        `http://localhost:5000/api/admin/staff/${editingStaff._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Staff updated", { autoClose: 1500 });
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      toast.error("Failed to update staff");
    }
  };

  // ✅ Updated Delete Logic with Fancy Modal
  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/staff/${staffToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Staff member removed successfully");
      fetchStaff();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete staff");
    } finally {
      setIsDeleting(false);
      setStaffToDelete(null);
    }
  };

  /* -------- FILTER -------- */
  const filtered = staff.filter(
    (s) =>
      (dept === "" || s.department === dept) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 transition-colors duration-300">
      <AdminNavbar />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
        .scale-in-center { animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Background Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <span className="cursor-pointer p-2.5 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 ease-out hover:scale-110 hover:-rotate-6 hover:shadow-rose-500/50">
                <Users className="w-6 h-6" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-600 to-purple-600 dark:from-rose-300 dark:via-fuchsia-300 dark:to-purple-300 drop-shadow-sm">
                Faculty Hub
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">
              Manage profiles, roles, and academic details for staff members.
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="group relative overflow-hidden rounded-2xl py-4 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Add Faculty Member
          </button>
        </div>

        {/* Toolbar */}
        <div className="sticky top-24 z-30 mb-10 p-2 rounded-[1.5rem] bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                placeholder="Search faculty by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg placeholder-slate-400 outline-none focus:bg-white/50 dark:focus:bg-[#0d1117]/50 transition-all"
              />
            </div>
            <div className="relative md:w-72 group">
              <Filter className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full pl-14 pr-10 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg appearance-none cursor-pointer outline-none focus:bg-white/50 dark:focus:bg-[#0d1117]/50 transition-all"
              >
                <option value="" className="dark:bg-[#161b22]">
                  All Departments
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="dark:bg-[#161b22]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map((s) => (
              <StaffCard
                key={s._id}
                s={s}
                onView={() => setViewStaff(s)}
                onEdit={() => handleEditClick(s)}
                onDelete={() => {
                  setStaffToDelete(s);
                  setShowDeleteModal(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-50">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-2xl font-bold">No staff members found</h3>
            </div>
          )}
        </div>
      </main>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <Modal title="Add New Faculty" onClose={() => setIsAddModalOpen(false)}>
          <StaffForm
            form={form}
            setForm={setForm}
            file={file}
            setFile={setFile}
            onSubmit={addStaff}
            submitText="Add Staff Member"
            icon={Plus}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editingStaff && (
        <Modal title="Edit Staff Details" onClose={() => setEditingStaff(null)}>
          <StaffForm
            form={form}
            setForm={setForm}
            file={file}
            setFile={setFile}
            onSubmit={updateStaff}
            submitText="Save Changes"
            icon={Save}
          />
        </Modal>
      )}

      {/* VIEW MODAL */}
      {viewStaff && (
        <StaffDetailsModal
          staff={viewStaff}
          onClose={() => setViewStaff(null)}
        />
      )}

      {/* ✅ FANCY MODERN DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_80px_-20px_rgba(244,63,94,0.3)] overflow-hidden scale-in-center">
            {/* Ambient Background Glow for Modal */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 blur-[60px] pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20 animate-pulse">
                <AlertTriangle size={40} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-black mb-2 tracking-tight uppercase">
                Confirm Deletion
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  "{staffToDelete?.name}"
                </span>
                ? This profile and all its data will be permanently deleted.
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  disabled={isDeleting}
                  onClick={confirmDeleteStaff}
                  className={`w-full py-4 rounded-2xl bg-rose-600 text-white font-bold transition-all hover:bg-rose-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {isDeleting ? "Deleting Member..." : "Yes, Delete Staff"}
                </button>

                <button
                  disabled={isDeleting}
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

const StaffCard = ({ s, onView, onEdit, onDelete }) => (
  <div
    onClick={onView}
    className="group relative cursor-pointer bg-white dark:bg-[#161b22]/60 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col"
  >
    <div className="h-52 relative overflow-hidden shrink-0">
      {s.photo ? (
        <img
          src={s.photo}
          alt={s.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-6xl font-black text-white/30">{s.name[0]}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#090c10] via-transparent to-transparent opacity-80" />

      <div className="absolute bottom-4 left-6 right-6 text-white">
        <h3 className="text-2xl font-black truncate drop-shadow-md">
          {s.name}
        </h3>
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">
          {s.position}
        </p>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center transition-colors">
          <Clock className="w-4 h-4 mx-auto mb-1 text-rose-500" />
          <p className="text-xs font-black text-slate-700 dark:text-slate-200">
            {s.experience || 0} Yrs
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center transition-colors">
          <GraduationCap className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
          <p className="text-xs font-black text-slate-700 dark:text-slate-200 truncate">
            {s.qualification || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents double-triggering the parent's onClick
            onView();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500/10 text-white dark:text-indigo-300 font-bold text-sm hover:bg-indigo-700 dark:hover:bg-indigo-500/20 transition-all shadow-md shadow-indigo-500/20"
        >
          View Profile
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents redirecting to profile when clicking Edit
            onEdit();
          }}
          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents redirecting to profile when clicking Delete
            onDelete();
          }}
          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
    <div className="relative w-full max-w-2xl bg-white/80 dark:bg-[#161b22]/90 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]">
      <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600 shrink-0 flex items-center px-8 relative">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6" /> {title}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  </div>
);

const StaffForm = ({
  form,
  setForm,
  file,
  setFile,
  onSubmit,
  submitText,
  icon: Icon,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input
        label="Full Name"
        placeholder="Dr. Jane Smith"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* ✅ EMAIL FIELD (ADDED) */}
      <Input
        label="Email Address"
        type="email"
        placeholder="faculty@college.edu"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        label="Qualification"
        placeholder="Ph.D, M.Tech"
        value={form.qualification || ""}
        onChange={(e) => setForm({ ...form, qualification: e.target.value })}
      />

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
          Position
        </label>
        <select
          className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          value={form.position || ""}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        >
          <option value="">Select Position</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
          Department
        </label>
        <select
          className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          value={form.department || ""}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Select Dept</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Experience (Years)"
        type="number"
        placeholder="10"
        value={form.experience || ""}
        onChange={(e) => setForm({ ...form, experience: e.target.value })}
      />

      <Input
        label="Subjects"
        placeholder="Data Structures, AI"
        value={form.subjects || ""}
        onChange={(e) => setForm({ ...form, subjects: e.target.value })}
      />
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        Biography
      </label>
      <textarea
        className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none"
        placeholder="Professional background..."
        value={form.bio || ""}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        Profile Photo
      </label>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-400 transition-all cursor-pointer">
        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
        <span className="text-sm font-bold text-indigo-500">
          {file ? file.name : "Click to upload image"}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>
    </div>

    <button
      onClick={onSubmit}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-lg shadow-xl shadow-indigo-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
    >
      <Icon size={20} /> {submitText}
    </button>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);

/* ================= UPDATED VIEW MODAL ================= */

const StaffDetailsModal = ({ staff, onClose }) => {
  const subjects = normalizeSubjects(staff.subjects);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 dark:bg-[#05070a]/90 backdrop-blur-xl p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-[#0d1117] rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col md:flex-row shadow-3xl h-[90vh] md:h-[85vh] max-h-[800px] transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel: Profile & Branding (Stacks on top for mobile) */}
        <div className="w-full md:w-2/5 shrink-0 bg-gradient-to-b from-indigo-600 via-indigo-700 to-violet-800 dark:via-violet-800 dark:to-[#0d1117] p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Decorative shapes - Hidden on very small screens for clarity */}
          <div className="absolute inset-0 opacity-10 pointer-events-none hidden sm:block">
            <div className="absolute top-[-5%] left-[-5%] w-64 h-64 border-[30px] border-white rounded-full" />
            <div className="absolute bottom-[-5%] right-[-5%] w-32 h-32 border-[15px] border-white rounded-full" />
          </div>

          <div className="relative group">
            <div className="w-36 h-36 md:w-52 md:h-52 rounded-[2rem] md:rounded-[2.5rem] border-4 border-white/30 p-1 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm transition-transform duration-500">
              {staff.photo ? (
                <img
                  src={staff.photo}
                  className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[2rem]"
                  alt={staff.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl md:text-7xl font-black text-white/50">
                  {staff.name[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white px-2 md:px-3 py-1 rounded-lg font-black text-[8px] md:text-[10px] shadow-lg border-2 border-indigo-700 dark:border-[#0d1117]">
              ONLINE
            </div>
          </div>

          <div className="mt-6 md:mt-8 z-10">
            <h2 className="text-xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
              {staff.name}
            </h2>
            <div className="mt-2 inline-block px-3 md:px-4 py-1 rounded-full bg-white/20 border border-white/30 text-white font-bold uppercase tracking-widest text-[8px] md:text-[10px]">
              {staff.position}
            </div>
          </div>
        </div>

        {/* Right Panel: Content Grid (Scrollable internally) */}
        <div className="flex-1 p-6 md:p-10 relative flex flex-col overflow-y-auto custom-scrollbar">
          {/* Close Button - Stays fixed in the corner of the content panel */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-500 transition-all border border-slate-200 dark:border-white/10 z-50"
          >
            <X size={20} />
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
                Faculty Profile Data
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-indigo-500/50 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                <GraduationCap className="w-5 h-5 text-indigo-500 md:mb-2 shrink-0" />
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">
                    Academic
                  </h4>
                  <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                    {staff.qualification}
                  </p>
                </div>
              </div>
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-rose-500/50 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                <Briefcase className="w-5 h-5 text-rose-500 md:mb-2 shrink-0" />
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">
                    Experience
                  </h4>
                  <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                    {staff.experience} Years
                  </p>
                </div>
              </div>
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-emerald-500/50 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                <Mail className="w-5 h-5 text-emerald-500 md:mb-2 shrink-0" />
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">
                    Email
                  </h4>
                  <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white break-all">
                    {staff.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Expertise */}
            <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <h4 className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-3 md:mb-4">
                Subject Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {subjects.length > 0 ? (
                  subjects.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 md:px-3 md:py-1.5 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold text-[10px] md:text-[11px]"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No subjects listed
                  </span>
                )}
              </div>
            </div>

            {/* Biography */}
            <div className="px-1 md:px-2 pb-4">
              <h4 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Professional Biography
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs md:text-sm">
                {staff.bio ||
                  "Academic profile details are currently being updated by the administration."}
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500" />
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {staff.department} Department
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Staff;
