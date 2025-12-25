import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Heart,
  User,
  Layers,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";

const ProjectCard = ({
  project,
  currentUserId,
  onUnauthLike,
  refresh,
  isOwner = false,
}) => {
  const navigate = useNavigate();

  // Local state for likes and liking action
  const [likes, setLikes] = useState(project?.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  // States for Modern Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if parent props change
  useEffect(() => {
    setLikes(project?.likes || []);
  }, [project?.likes]);

  // Ensure both IDs are converted to Strings for comparison
  const safeUserId = currentUserId ? String(currentUserId) : null;
  const isLiked = safeUserId && likes.some((uid) => String(uid) === safeUserId);
  const likesCount = likes.length;

  const handleLike = async (e) => {
    e.stopPropagation();
    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
      toast.error("Please login to like!");
      return;
    }

    if (isOwner || isLiking) return;
    setIsLiking(true);

    try {
      const { data } = await API.post(`/projects/${project._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      toast.error("Like failed");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeleteTrigger = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await API.delete(`/projects/${project._id}`);
      toast.success("Project removed permanently");
      setShowDeleteModal(false);
      refresh?.();
    } catch (err) {
      toast.error("Delete operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/projects/edit/${project._id}`);
  };

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .animate-pop { animation: heartPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.49); }
        .scale-in { animation: scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scale-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Main Card */}
      <div
        onClick={() => navigate(`/projects/${project?._id}`)}
        className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] 
             bg-white/90 dark:bg-[#0a0a0f]/95 backdrop-blur-3xl 
             border border-slate-200 dark:border-white/10 
             shadow-xl flex flex-col h-full min-h-[280px]
             transition-all duration-500 ease-out
             hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.01]
             hover:shadow-[10px_20px_50px_-20px_rgba(99,102,241,0.3)]"
      >
        <div className="p-8 flex flex-col h-full relative z-10">
          {!isOwner && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#16161a] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                {project.user?.profilePic ? (
                  <img
                    src={project.user.profilePic}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base truncate mb-1 leading-none">
                  {project.user?.name || "Unknown"}
                </p>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {project.user?.department || "CSE"}
                </span>
              </div>
            </div>
          )}

          <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white leading-tight group-hover:text-indigo-500 transition-colors uppercase">
            {project.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8">
            {project.description}
          </p>

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            {!isOwner ? (
              <button
                onClick={handleLike}
                disabled={isLiking}
                // ✅ FIXED: Using group/heart to coordinate hover colors for all children
                className={`flex items-center gap-2.5 transition-all duration-300 active:scale-90 group/heart 
                ${
                  isLiked
                    ? "text-red-500"
                    : "text-slate-400 dark:text-slate-600 hover:text-red-500"
                }`}
              >
                <Heart
                  size={26}
                  // ✅ FIXED: Added group-hover/heart:stroke-red-500 for consistent icon color on hover
                  className={`transition-all duration-500 group-hover/heart:-rotate-12 group-hover/heart:scale-110
                  ${
                    isLiked
                      ? "fill-red-500 stroke-red-500 animate-pop drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                      : "fill-none stroke-current group-hover/heart:stroke-red-500"
                  }`}
                />
                {/* ✅ FIXED: Added group-hover/heart:text-red-500 to ensure the number changes color with the heart */}
                <span
                  className={`font-black text-lg transition-colors duration-300 ${
                    !isLiked && "group-hover/heart:text-red-500"
                  }`}
                >
                  {likesCount}
                </span>
              </button>
            ) : (
              <div className="w-full flex justify-between items-center">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-60">
                  Author Tools
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={handleDeleteTrigger}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ FANCY MODERN DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0b0c15] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 shadow-[0_0_80px_-20px_rgba(244,63,94,0.4)] overflow-hidden scale-in">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 blur-[60px] pointer-events-none" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20 animate-pulse">
                <AlertTriangle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight uppercase dark:text-white">
                Delete Project?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 italic">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  "{project.title}"
                </span>
                ? This action is permanent.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className={`w-full py-4 rounded-2xl bg-rose-600 text-white font-black text-xs tracking-widest transition-all hover:bg-rose-700 hover:scale-[1.02] shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {isDeleting ? "REMOVING..." : "CONFIRM DELETE"}
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
