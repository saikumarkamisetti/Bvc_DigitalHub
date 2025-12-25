import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  Save,
  X,
  Github,
  Type,
  FileText,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [existingMedia, setExistingMedia] = useState([]);
  const [removedMedia, setRemovedMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    API.get(`/projects/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setRepoLink(res.data.repoLink || "");
        setExistingMedia(res.data.media || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load project details");
        navigate("/projects");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const removeExisting = (url) => {
    setRemovedMedia((prev) => [...prev, url]);
    setExistingMedia((prev) => prev.filter((m) => m !== url));
  };

  const handleUpdate = async () => {
    if (!title || !description) {
      return toast.warning("Title and description are required");
    }

    setSaving(true);
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("repoLink", repoLink);

    removedMedia.forEach((m) => data.append("removedMedia[]", m));
    if (newFiles.length > 0) {
      Array.from(newFiles).forEach((f) => data.append("media", f));
    }

    try {
      await API.put(`/projects/${id}`, data);
      toast.success("Project updated successfully!");
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C15] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0C15] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      <Navbar />

      {/* --- BACKGROUND GLOW --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#23263a_1px,transparent_1px),linear-gradient(to_bottom,#23263a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto pt-32 px-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-400 dark:to-emerald-400">
            Edit Project
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#13151f] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl">
          {/* Title Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              <Type size={14} /> Project Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0B0C15] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="e.g. AI Content Generator"
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              <FileText size={14} /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 bg-slate-50 dark:bg-[#0B0C15] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
              placeholder="Describe what your project does..."
            />
          </div>

          {/* Repo Link Input */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              <Github size={14} /> Repository Link
            </label>
            <input
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0B0C15] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-indigo-600 dark:text-cyan-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="https://github.com/username/project"
            />
          </div>

          {/* Media Section */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
              <ImageIcon size={14} /> Project Media
            </label>

            <div className="p-4 bg-slate-50 dark:bg-[#0B0C15] rounded-2xl border border-slate-200 dark:border-white/5">
              {/* Existing Images */}
              {existingMedia.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {existingMedia.map((m, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-white/10"
                    >
                      <img
                        src={m}
                        alt="Project media"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeExisting(m)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewFiles(e.target.files)}
                className="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-full file:border-0
                    file:text-xs file:font-bold
                    file:bg-indigo-100 dark:file:bg-indigo-500/10 
                    file:text-indigo-600 dark:file:text-indigo-400
                    hover:file:bg-indigo-200 dark:hover:file:bg-indigo-500/20
                    cursor-pointer"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProject;
