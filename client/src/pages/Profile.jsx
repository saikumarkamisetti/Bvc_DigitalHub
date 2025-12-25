import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";
import {
  Camera,
  Upload,
  X,
  Save,
  Edit3,
  Plus,
  User as UserIcon,
  Github,
  Type,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  Layers,
  Calendar,
  Hash,
  Sparkles,
  Zap,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);

  // States for media and modals
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    repoLink: "",
    files: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  /* ================= 📡 FETCH PROFILE SYNC ================= */
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
      setPreview(res.data.profilePic || null);

      // Sync form data with server response so inputs are up-to-date
      setFormData({
        name: res.data.name || "",
        department: res.data.department || "",
        year: String(res.data.year || ""),
        rollNumber: res.data.rollNumber || "",
        bio: res.data.bio || "",
        skills: Array.isArray(res.data.skills)
          ? res.data.skills.join(", ")
          : "",
      });
    } catch {
      toast.error("Failed to load profile details.");
    }
  };

  const fetchMyProjects = async () => {
    try {
      const res = await API.get("/projects/my");
      setProjects(res.data);
    } catch {
      console.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyProjects();
  }, []);

  /* ================= 🛠️ UPDATE PROFILE (GLOSSY & FIXED) ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // ✅ Explicitly append all fields to FormData
      data.append("name", formData.name);
      data.append("department", formData.department);
      data.append("year", String(formData.year)); // This forces the update for "Batch"
      data.append("rollNumber", formData.rollNumber);
      data.append("bio", formData.bio);

      // ✅ Send skills as a plain string for the backend to handle
      data.append("skills", formData.skills);

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      // ✅ PUT Request
      await API.put("/users/me", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile Refined! ✨", { autoClose: 1500 });
      setEditing(false);
      setProfilePic(null);

      // ✅ CRITICAL: Re-fetch user from DB to update state immediately
      await fetchProfile();
    } catch (err) {
      console.error("AXIOS UPDATE ERROR:", err);
      toast.error("Update failed. Check connection.");
    }
  };

  /* ================= 🚀 CREATE PROJECT ================= */
  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      return toast.error("Title and description required");
    }
    const data = new FormData();
    data.append("title", projectForm.title);
    data.append("description", projectForm.description);
    data.append("repoLink", projectForm.repoLink);
    Array.from(projectForm.files).forEach((f) => data.append("media", f));

    try {
      setUploading(true);
      await API.post("/projects", data);
      toast.success("Added to portfolio! 🚀");
      setShowProjectModal(false);
      setProjectForm({ title: "", description: "", repoLink: "", files: [] });
      fetchMyProjects();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const triggerDeleteModal = (proj) => {
    setProjectToDelete(proj);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/projects/${projectToDelete._id}`);
      toast.success("Removed from showcase");
      fetchMyProjects();
      setShowDeleteModal(false);
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030407] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-700">
      <Navbar />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .glass-panel { background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(30px); }
        .dark .glass-panel { background: rgba(22, 27, 34, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); }
        .flashy-text { background: linear-gradient(to right, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .scale-in { animation: scale-in 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @keyframes scale-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="h-28" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        {user && (
          <div className="relative mb-16 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] opacity-10 blur-3xl group-hover:opacity-20 transition duration-1000"></div>

            <div className="relative glass-panel backdrop-blur-3xl rounded-[2.8rem] overflow-hidden shadow-2xl transition-all duration-700">
              <div className="h-48 md:h-56 bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/10 skew-x-[-25deg] animate-[shimmer_3s_infinite] pointer-events-none"></div>
              </div>

              <div className="px-6 md:px-14 pb-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 -mt-20 relative z-10">
                  <div className="relative group/avatar shrink-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] bg-white dark:bg-[#0d1117] p-2 shadow-2xl transition-transform duration-500 hover:scale-105">
                      <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-[#161b22] relative border border-slate-200 dark:border-white/5">
                        <img
                          src={preview || "/default-avatar.png"}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                        <label className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer">
                          <Camera className="text-white w-10 h-10 mb-1" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            Update
                          </span>
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files[0];
                              if (f) {
                                setProfilePic(f);
                                setPreview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full pt-2 md:pt-24">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-10">
                      <div className="text-center md:text-left space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase flashy-text leading-tight">
                          {user.name}
                        </h1>
                        <p className="text-slate-500 font-bold tracking-wide flex items-center justify-center md:justify-start gap-2 opacity-80">
                          <Zap size={16} className="text-amber-500" />{" "}
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditing(!editing)}
                        className={`group flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black transition-all border shadow-lg hover:-translate-y-1 ${
                          editing
                            ? "bg-rose-500 text-white border-rose-400"
                            : "bg-white dark:bg-white/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                        }`}
                      >
                        {editing ? <X size={20} /> : <Edit3 size={20} />}
                        {editing ? "CANCEL" : "EDIT PROFILE"}
                      </button>
                    </div>

                    {!editing ? (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                          <InfoItem
                            label="Field"
                            value={user.department}
                            icon={Layers}
                            color="text-indigo-500"
                          />
                          <InfoItem
                            label="Batch"
                            value={user.year}
                            icon={Calendar}
                            color="text-fuchsia-500"
                          />
                          <InfoItem
                            label="ID"
                            value={user.rollNumber}
                            icon={Hash}
                            color="text-cyan-500"
                          />
                          <InfoItem
                            label="Works"
                            value={projects.length}
                            icon={FileText}
                            color="text-rose-500"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-8 rounded-[2rem] bg-slate-50/50 dark:bg-black/20 border border-slate-200/50 dark:border-white/5">
                            <h3 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em] mb-4">
                              Professional Bio
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic">
                              "{user.bio || "No biography provided yet."}"
                            </p>
                          </div>
                          <div className="p-8 rounded-[2rem] bg-slate-50/50 dark:bg-black/20 border border-slate-200/50 dark:border-white/5">
                            <h3 className="text-[10px] font-black uppercase text-purple-500 tracking-[0.3em] mb-4">
                              Core Competencies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {(user.skills || []).map((s, i) => (
                                <span
                                  key={i}
                                  className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-black uppercase rounded-xl shadow-sm"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleUpdate}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-top-4 duration-300"
                      >
                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                          <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(v) =>
                              setFormData({ ...formData, name: v })
                            }
                            placeholder="Your Name"
                          />
                          <Input
                            label="Department"
                            value={formData.department}
                            onChange={(v) =>
                              setFormData({ ...formData, department: v })
                            }
                            placeholder="e.g. CSE"
                          />
                          <Input
                            label="Academic Year (Batch)"
                            value={formData.year}
                            onChange={(v) =>
                              setFormData({ ...formData, year: v })
                            }
                            placeholder="e.g. 5"
                          />
                          <Input
                            label="Roll Number"
                            value={formData.rollNumber}
                            onChange={(v) =>
                              setFormData({ ...formData, rollNumber: v })
                            }
                            placeholder="e.g. 21BCE..."
                          />
                          <Input
                            label="Skills (Comma Separated)"
                            value={formData.skills}
                            onChange={(v) =>
                              setFormData({ ...formData, skills: v })
                            }
                            placeholder="React, Node, Figma"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">
                            Biography
                          </label>
                          <textarea
                            rows="3"
                            value={formData.bio}
                            onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                            }
                            className="w-full p-6 rounded-3xl bg-slate-100/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 transition-all text-sm font-medium resize-none shadow-inner"
                            placeholder="Tell the world your story..."
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end pt-4">
                          <button
                            type="submit"
                            className="flex items-center gap-3 px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/30 hover:scale-[1.03] active:scale-95 transition-all"
                          >
                            <Save size={20} /> Update Profile
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                <Sparkles className="text-indigo-500" /> Project Portfolio
              </h2>
              <p className="text-slate-500 font-medium">
                Showcasing technical excellence and creativity.
              </p>
            </div>
            <button
              onClick={() => setShowProjectModal(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-[#161b22] text-slate-900 dark:text-white font-black rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all active:scale-95"
            >
              <div className="p-1.5 bg-indigo-500 rounded-xl text-white group-hover:rotate-90 transition-transform">
                <Plus size={18} />
              </div>
              Post New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                isOwner={true}
                onDelete={() => triggerDeleteModal(p)}
                refresh={fetchMyProjects}
              />
            ))}
          </div>
        </section>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0b0c15] border border-slate-200 dark:border-white/10 rounded-[3rem] p-12 shadow-[0_0_80px_-20px_rgba(244,63,94,0.4)] overflow-hidden scale-in">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 blur-[60px] pointer-events-none" />
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 animate-pulse">
                <AlertTriangle size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-black mb-3 tracking-tighter uppercase">
                Delete Project?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-12 italic">
                Removing{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  "{projectToDelete?.title}"
                </span>{" "}
                is permanent.
              </p>
              <div className="flex flex-col w-full gap-4">
                <button
                  disabled={isDeleting}
                  onClick={confirmDeleteProject}
                  className="w-full py-4 rounded-2xl bg-rose-600 text-white font-black transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-3 hover:bg-rose-700"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Trash2 size={20} />
                  )}{" "}
                  Confirm Removal
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
                >
                  Abort Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !uploading && setShowProjectModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#13151f] rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.3)] flex flex-col max-h-[85vh] overflow-hidden scale-in">
            <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
              <h2 className="text-3xl font-black flashy-text tracking-tighter">
                Add Portfolio Piece
              </h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-3 rounded-full bg-white dark:bg-white/5 shadow-md"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
              <Input
                label="Title"
                value={projectForm.title}
                onChange={(v) => setProjectForm({ ...projectForm, title: v })}
                placeholder="Enter Project Name"
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest block">
                  Project Vision
                </label>
                <textarea
                  rows="4"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-6 rounded-3xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 transition-all font-medium text-sm shadow-inner"
                  placeholder="What makes this project special?"
                />
              </div>
              <Input
                label="Repository Link"
                value={projectForm.repoLink}
                onChange={(v) =>
                  setProjectForm({ ...projectForm, repoLink: v })
                }
                placeholder="https://github.com/..."
              />
              <div className="relative h-40 rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex flex-col items-center justify-center cursor-pointer group hover:border-indigo-500/50 transition-all">
                <Upload
                  className="text-slate-400 group-hover:text-indigo-500 transition-all"
                  size={32}
                />
                <p className="text-xs font-black text-slate-500 mt-3 uppercase tracking-widest">
                  {projectForm.files.length
                    ? `${projectForm.files.length} Files Picked`
                    : "Drop Media Assets Here"}
                </p>
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, files: e.target.files })
                  }
                />
              </div>
              <button
                onClick={handleCreateProject}
                disabled={uploading}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <Zap size={24} />
                )}{" "}
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- REUSABLE UI ELEMENTS --- */
const Input = ({ label, value, onChange, placeholder = "" }) => (
  <div className="w-full">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 px-6 rounded-2xl bg-slate-100/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 transition-all text-sm font-bold shadow-inner"
    />
  </div>
);

const InfoItem = ({ label, value, icon: Icon, color }) => (
  <div className="p-5 rounded-[2rem] bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300">
    <div
      className={`p-2 rounded-xl bg-slate-50 dark:bg-black/20 mb-2 ${color}`}
    >
      <Icon size={18} />
    </div>
    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">
      {label}
    </p>
    <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-full tracking-tight">
      {value || "—"}
    </p>
  </div>
);

export default Profile;
