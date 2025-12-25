import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Heart,
  ArrowLeft,
  ExternalLink,
  Share2,
  Check,
  Layers,
  Calendar,
  Image as ImageIcon,
  User,
  Maximize2,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../services/api";

// ✅ Updated Hook to recognize Admin IDs for Liking
const useCurrentUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      const adminRaw = localStorage.getItem("admin");

      if (userRaw) {
        const user = JSON.parse(userRaw);
        setUserId(user._id || user.id);
      } else if (adminRaw) {
        const admin = JSON.parse(adminRaw);
        setUserId(admin._id || admin.id);
      }
    } catch (error) {
      console.error("Failed to parse session from local storage:", error);
    }
  }, []);

  return userId;
};

const LoadingScreen = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020205]">
    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
    <p className="mt-4 text-xs font-black tracking-widest text-indigo-500 animate-pulse uppercase">
      Loading Project...
    </p>
  </div>
);

const Avatar = ({ user }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <User size={24} className="text-slate-400 dark:text-slate-600" />
      )}
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = useCurrentUserId();

  const [project, setProject] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);
  const errorShownRef = useRef(false);

  // ✅ FIXED: Dependency array is constant [id, navigate] to stop the React error
  useEffect(() => {
    let cancelled = false;

    // Access control: Admin or User
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token && !adminToken) {
      toast.error("Please login to view projects");
      navigate("/login");
      return;
    }

    const fetchProject = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        if (!cancelled) {
          setProject({
            ...data,
            likes: Array.isArray(data.likes) ? data.likes : [],
            media: Array.isArray(data.media) ? data.media : [],
          });
        }
      } catch (error) {
        if (!errorShownRef.current) {
          errorShownRef.current = true;
          toast.error("Failed to load project");
        }
      }
    };

    fetchProject();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (!project) {
    return <LoadingScreen />;
  }

  const safeUserId = currentUserId ? String(currentUserId) : null;
  const isLiked =
    safeUserId && project.likes.some((uid) => String(uid) === safeUserId);
  const likesCount = project.likes.length;

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token && !adminToken) {
      toast.error("Please login to like");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      // API call will now use whichever token is active thanks to fixed api.js
      const { data } = await API.post(`/projects/${project._id}/like`);

      setProject((prev) => ({
        ...prev,
        likes: data.likes,
      }));
    } catch (err) {
      // ✅ Improved error logging to see exactly why it failed
      toast.error(
        err.response?.status === 401 ? "Unauthorized action" : "Action failed"
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const uName = project.user?.name || "Unknown";
  const uDept = project.user?.department || "General";
  const postDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const renderMediaContent = () => {
    if (project.media.length > 0) {
      return project.media.map((url, index) => (
        <div
          key={index}
          className="relative w-full rounded-2xl overflow-hidden bg-white dark:bg-[#12121a] shadow-xl border border-slate-300 dark:border-white/10 group transition-all"
        >
          <div className="relative z-10 flex items-center justify-center p-1.5">
            {url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                controls
                className="w-full h-auto max-h-[60vh] object-contain rounded-xl bg-black"
              >
                <source src={url} />
              </video>
            ) : (
              <img
                src={url}
                alt="Visual"
                className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      ));
    }
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
        <ImageIcon size={60} strokeWidth={1} />
        <p className="mt-4 font-bold text-xs uppercase tracking-widest opacity-50">
          Visual Documentation Empty
        </p>
      </div>
    );
  };

  const renderActionButtons = () => (
    <div className="p-6 lg:p-8 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-[2] relative h-14 rounded-2xl font-black transition-all duration-300 active:scale-90 flex items-center justify-center gap-3 border overflow-hidden ${
            isLiked
              ? "bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
              : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
          }`}
        >
          <Heart
            size={24}
            className={`transition-all duration-300 ${
              isLiked
                ? "fill-rose-500 stroke-rose-500 scale-110"
                : "stroke-current"
            }`}
          />
          <span className="text-lg">{likesCount}</span>
        </button>

        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noreferrer"
            className="
              flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 px-6
              font-black transition-all duration-500 active:scale-95 group/repo
              bg-white text-gray-900 border border-slate-200 shadow-sm
              hover:bg-slate-50 hover:border-indigo-500/30 hover:shadow-lg
              dark:bg-white/5 dark:text-white dark:border-white/10
              dark:backdrop-blur-xl dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]
              dark:hover:bg-white/10 dark:hover:border-cyan-500/50
              dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]
            "
          >
            <ExternalLink
              size={20}
              className="transition-transform duration-500 group-hover/repo:rotate-12 group-hover/repo:text-cyan-500"
            />
            <span className="hidden lg:inline text-sm tracking-widest uppercase">
              Source Code
            </span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/repo:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 translate-x-[-100%] group-hover/repo:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </a>
        )}

        <button
          onClick={handleShare}
          className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-90 text-slate-500 dark:text-slate-400 hover:text-indigo-500"
        >
          {copied ? (
            <Check className="text-emerald-500" />
          ) : (
            <Share2 size={20} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
      <div className="h-screen w-full bg-slate-50 dark:bg-[#030407] text-slate-900 dark:text-white flex flex-col overflow-hidden transition-colors duration-500 relative">
        <Navbar />
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-[140px]" />
        </div>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 lg:p-8 pt-20 lg:pt-24 min-h-0">
          <div className="w-full max-w-[1400px] mb-4 shrink-0 px-2 flex justify-start">
            {/* ✅ FIXED BACK BUTTON: Uses navigate(-1) to go back to the exact previous profile URL */}
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-indigo-500/50 backdrop-blur-xl transition-all duration-300 shadow-sm"
            >
              <ArrowLeft
                size={16}
                className="text-indigo-500 group-hover:text-indigo-500 transition-colors"
              />
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                Back
              </span>
            </button>
          </div>

          <div className="w-full max-w-[1400px] h-[78vh] flex flex-col lg:flex-row bg-white/90 dark:bg-[#0b0b12]/95 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-50 z-20"></div>

            {/* Left Side - Media */}
            <div className="w-full lg:w-[55%] bg-slate-200/50 dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 relative flex flex-col h-[45%] lg:h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 no-scrollbar">
                {renderMediaContent()}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-200/80 dark:from-black/80 to-transparent pointer-events-none transition-opacity duration-300" />
            </div>

            {/* Right Side - Details */}
            <div className="w-full lg:w-[45%] flex flex-col h-[55%] lg:h-full bg-transparent relative min-h-0">
              <div className="p-8 lg:p-10 border-b border-slate-200 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-40 blur group-hover:opacity-70 transition duration-500"></div>
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1a1a23] border border-slate-200 dark:border-white/10 shadow-inner">
                      <Avatar user={project.user} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {uName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <Layers size={12} /> {uDept}
                      </span>
                      <span className="flex items-center gap-1.5 opacity-60">
                        <Calendar size={12} /> {postDate}
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-slate-500 leading-tight tracking-tight uppercase">
                  {project.title}
                </h1>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-10 min-h-0 no-scrollbar">
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                  {project.description || "No project description available."}
                </p>
              </div>
              {renderActionButtons()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectDetails;
