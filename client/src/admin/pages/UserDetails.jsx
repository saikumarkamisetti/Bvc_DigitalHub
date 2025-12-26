import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";
import {
  User,
  Mail,
  Hash,
  BookOpen,
  FileText,
  Save,
  Trash2,
  Edit2,
  Camera,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Layers,
  Eye,
  AlertTriangle,
  Info,
  Code,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";

const NAVBAR_HEIGHT = "80px";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [showProjDeleteModal, setShowProjDeleteModal] = useState(false);
  const [selectedProj, setSelectedProj] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    try {
      const userRes = await adminAPI.get(`/admin/users/${id}`);
      setUser(userRes.data);
      try {
        const projectRes = await adminAPI.get(`/admin/projects/user/${id}`);
        setProjects(projectRes.data || []);
      } catch (err) {
        setProjects([]);
      }
    } catch (err) {
      toast.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateUser = async () => {
    try {
      const data = new FormData();
      ["name", "email", "rollNumber", "department", "year", "bio"].forEach(
        (key) => {
          data.append(key, user[key] || "");
        }
      );
      if (newPassword) data.append("password", newPassword);
      if (profilePicFile) data.append("profilePic", profilePicFile);
      if (user.skills) {
        const skillsArray =
          typeof user.skills === "string"
            ? user.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : user.skills;
        data.append("skills", JSON.stringify(skillsArray));
      }
      await adminAPI.put(`/admin/users/${id}`, data);
      toast.success("User updated successfully");
      setEditing(false);
      setNewPassword("");
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  const confirmDeleteUser = async () => {
    setIsProcessing(true);
    try {
      await adminAPI.delete(`/admin/users/${id}`);
      toast.success("Account permanently deleted");
      navigate("/admin/users");
    } catch {
      toast.error("Delete operation failed");
      setIsProcessing(false);
      setShowUserDeleteModal(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!selectedProj) return;
    setIsProcessing(true);
    try {
      await adminAPI.delete(`/admin/projects/${selectedProj._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== selectedProj._id));
      toast.success("Project removed");
      setShowProjDeleteModal(false);
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsProcessing(false);
      setSelectedProj(null);
    }
  };

  if (!user)
    return (
      <div className="h-screen bg-slate-50 dark:bg-[#05070a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen md:h-screen w-full bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-white flex flex-col md:overflow-hidden relative transition-colors duration-300">
      <AdminNavbar />

      <main
        className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6 md:overflow-hidden relative z-10"
        style={{ marginTop: NAVBAR_HEIGHT }}
      >
        {/* LEFT PANEL - Profile Block Fixed to contain scrollbar */}
        <div className="w-full md:w-[380px] shrink-0 bg-white/70 dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl dark:shadow-2xl relative h-fit md:h-full overflow-hidden">
          <div className="h-full w-full overflow-y-auto custom-scrollbar-thin p-6 md:p-8 flex flex-col items-center">
            <button
              onClick={() => navigate("/admin/users")}
              className="absolute top-6 left-6 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-all active:scale-95"
            >
              <ArrowLeft
                size={18}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </button>

            <div className="relative group mb-6 md:mb-8 mt-4">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] md:rounded-[2.5rem] p-1 bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg">
                <div className="w-full h-full rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden bg-slate-100 dark:bg-[#0d1117] relative">
                  <img
                    src={
                      preview ||
                      user.profilePic ||
                      "https://via.placeholder.com/150"
                    }
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                  {editing && (
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-100 transition-all duration-300 backdrop-blur-sm">
                      <Camera size={24} className="mb-1 text-white" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setProfilePicFile(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-center mb-1 tracking-tight uppercase leading-tight px-4 break-words w-full">
              {user.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs mb-8 md:mb-10 text-center font-mono opacity-80 break-all px-4">
              {user.email}
            </p>

            <div className="flex flex-col gap-3 w-full mt-auto">
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                  >
                    <Edit2 size={18} /> Edit User
                  </button>
                  <button
                    onClick={() => setShowUserDeleteModal(true)}
                    className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-rose-50 dark:bg-rose-500/5 text-rose-600 dark:text-rose-500 font-bold border border-rose-200 dark:border-rose-500/10 active:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Delete Account
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={updateUser}
                    className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setPreview(null);
                      setNewPassword("");
                    }}
                    className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold active:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white/70 dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden shadow-xl dark:shadow-2xl mb-20 md:mb-0">
          <div className="relative md:absolute md:inset-0 md:overflow-y-auto custom-scrollbar p-6 md:p-12">
            <section className="mb-10 md:mb-12">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <Input
                  label="Name"
                  value={user.name}
                  disabled={!editing}
                  icon={User}
                  onChange={(v) => setUser({ ...user, name: v })}
                />
                <Input
                  label="Email"
                  value={user.email}
                  disabled={!editing}
                  icon={Mail}
                  onChange={(v) => setUser({ ...user, email: v })}
                />
                <Input
                  label="Roll Number"
                  value={user.rollNumber || ""}
                  disabled={!editing}
                  icon={Hash}
                  onChange={(v) => setUser({ ...user, rollNumber: v })}
                />
                <Input
                  label="Year"
                  value={user.year || ""}
                  disabled={!editing}
                  icon={Calendar}
                  onChange={(v) => setUser({ ...user, year: v })}
                />
                <Select
                  label="Dept"
                  value={user.department || ""}
                  disabled={!editing}
                  icon={BookOpen}
                  onChange={(v) => setUser({ ...user, department: v })}
                />
                <Input
                  label="Skills"
                  value={
                    Array.isArray(user.skills)
                      ? user.skills.join(", ")
                      : user.skills || ""
                  }
                  disabled={!editing}
                  icon={Code}
                  onChange={(v) => setUser({ ...user, skills: v })}
                />
                <Input
                  label="New Password"
                  value={newPassword}
                  disabled={!editing}
                  icon={Lock}
                  type="password"
                  placeholder="Leave blank to keep current"
                  onChange={(v) => setNewPassword(v)}
                />
              </div>
            </section>

            <div className="pt-8 md:pt-10 border-t border-slate-200 dark:border-white/5">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400 mb-6 flex items-center gap-2">
                <Layers size={18} /> Projects ({projects.length})
              </h3>

              <div className="grid grid-cols-1 gap-3 pb-10">
                {projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="group p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="overflow-hidden pr-2">
                        <h4 className="font-bold truncate text-xs md:text-sm text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                          {proj.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0 ml-2 relative z-20">
                      <button
                        onClick={() => navigate(`/projects/${proj._id}`)}
                        className="p-2.5 rounded-xl bg-white dark:bg-white/5 text-slate-400 active:text-indigo-600 shadow-sm border border-slate-200 dark:border-white/5"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProj(proj);
                          setShowProjDeleteModal(true);
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/5 text-rose-500 active:bg-rose-500 active:text-white transition-all shadow-sm border border-rose-200 dark:border-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <Modal
        show={showUserDeleteModal}
        onClose={() => setShowUserDeleteModal(false)}
        onConfirm={confirmDeleteUser}
        title="Delete Account?"
        description={`Permanently remove "${user.name}"?`}
        isProcessing={isProcessing}
        variant="danger"
      />
      <Modal
        show={showProjDeleteModal}
        onClose={() => setShowProjDeleteModal(false)}
        onConfirm={confirmDeleteProject}
        title="Remove Project?"
        description={`Remove "${selectedProj?.title}"?`}
        isProcessing={isProcessing}
        variant="warning"
      />

      <style>{`
        /* General Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        
        /* Fixed Thin Scrollbar for Block Internal Scrolling */
        .custom-scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { 
          background: transparent; 
          margin-top: 15px; 
          margin-bottom: 15px; 
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { 
          background: rgba(99, 102, 241, 0.3); 
          border-radius: 20px; 
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }

        .scale-in { animation: scale-in 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

/* Reusable Components */
const Modal = ({
  show,
  onClose,
  onConfirm,
  title,
  description,
  isProcessing,
  variant,
}) => {
  if (!show) return null;
  const isDanger = variant === "danger";
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !isProcessing && onClose()}
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-[#0b0c15] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl scale-in">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${
              isDanger
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}
          >
            {isDanger ? <AlertTriangle size={32} /> : <Info size={32} />}
          </div>
          <h3 className="text-xl font-black mb-2 uppercase">{title}</h3>
          <p className="text-slate-500 text-xs mb-8">{description}</p>
          <div className="flex flex-col w-full gap-3">
            <button
              disabled={isProcessing}
              onClick={onConfirm}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                isDanger ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
              }`}
            >
              {isProcessing ? "Processing..." : "Confirm Action"}
            </button>
            <button
              disabled={isProcessing}
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-slate-100 dark:bg-white/5 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  disabled,
  icon: Icon,
  type = "text",
  placeholder = "",
}) => (
  <div className="w-full">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600">
        <Icon size={16} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-xs border transition-all outline-none ${
          disabled
            ? "bg-slate-100/50 dark:bg-white/[0.02] border-transparent text-slate-500"
            : "bg-white dark:bg-[#0b0c15] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-indigo-500/50"
        }`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const Select = ({ label, value, onChange, disabled, icon: Icon }) => (
  <div className="w-full">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600">
        <Icon size={16} />
      </div>
      <select
        className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-xs border appearance-none outline-none ${
          disabled
            ? "bg-slate-100/50 dark:bg-white/[0.02] border-transparent text-slate-500"
            : "bg-white dark:bg-[#0b0c15] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
        }`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Dept</option>
        {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default UserDetails;
