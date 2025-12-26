import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Sparkles,
  Tag,
  Copy,
  ExternalLink,
} from "lucide-react";

const NAVBAR_HEIGHT = 70;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/info/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCalendar = () => {
    const start = new Date(event.date)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    window.open(
      `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.title
      )}&dates=${start}/${start}&details=${encodeURIComponent(
        event.description
      )}&location=${encodeURIComponent(event.location)}`,
      "_blank"
    );
  };

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(event.location);
    toast.success("Location copied!");
  };

  const handleGoogleMapsRedirect = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      event.location
    )}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#030407]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute w-8 h-8 border-4 border-fuchsia-500/20 border-b-fuchsia-500 rounded-full animate-spin-slow" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#030407] text-slate-900 dark:text-white relative transition-all duration-700 flex flex-col">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600/25 blur-[100px] md:blur-[160px] animate-pulse rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-fuchsia-600/15 blur-[120px] md:blur-[200px] rounded-full" />
      </div>

      <main
        className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col flex-1 pb-10"
        style={{ paddingTop: NAVBAR_HEIGHT + 20 }}
      >
        <div className="flex items-center justify-between mb-6 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Event link copied!");
            }}
            className="p-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 hover:scale-110 active:scale-90 transition-all shadow-lg"
          >
            <Share2 size={20} className="text-fuchsia-500" />
          </button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
          {/* LEFT: BANNER */}
          <div className="lg:col-span-5 relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-[2.5rem] blur-md opacity-20 transition duration-1000" />
            <div className="relative w-full aspect-[4/3] lg:h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
              {/* ✅ Conditional Check for Image */}
              {event.banner ? (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
              ) : (
                /* ✅ Display this if event.banner is null/empty */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-10 text-center">
                  <div className="p-4 rounded-full bg-indigo-500/10 mb-4 border border-indigo-500/20">
                    <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
                  </div>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                    No Preview Available
                  </p>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#030407] via-[#030407]/40 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    BVC Exclusive
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] break-words drop-shadow-2xl">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0">
              <GlossyStat
                icon={Calendar}
                label="Date"
                value={new Date(event.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })}
                color="from-indigo-600 to-blue-500"
              />
              <GlossyStat
                icon={Clock}
                label="Time"
                value={event.time}
                color="from-fuchsia-600 to-pink-500"
              />
              <GlossyStat
                icon={MapPin}
                label="Venue"
                value={event.location}
                color="from-cyan-600 to-teal-500"
                onClick={handleGoogleMapsRedirect}
                isClickable
              />
            </div>

            <div className="relative rounded-[2.5rem] bg-white/40 dark:bg-white/[0.02] backdrop-blur-3xl border border-white/40 dark:border-white/10 p-8 lg:p-10 flex flex-col shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10">
                  <Tag size={14} className="text-indigo-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-indigo-300">
                    {event.category || "General"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles
                    className="text-fuchsia-500 animate-pulse"
                    size={20}
                  />
                  <span className="text-[10px] font-bold text-fuchsia-500 uppercase">
                    Live
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line font-medium opacity-90">
                  "{event.description}"
                </p>
              </div>

              <div className="pt-8 border-t border-slate-900/10 dark:border-white/10 flex items-center gap-4">
                <button
                  onClick={handleCopyLocation}
                  className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-90 shadow-md group"
                >
                  <Copy
                    size={24}
                    className="group-hover:rotate-6 transition-transform text-indigo-500"
                  />
                </button>

                {/* Increased size of calendar button */}
                <button
                  onClick={handleAddToCalendar}
                  className="flex-1 group relative overflow-hidden 
    py-4 md:py-6 /* 👈 Reduced padding on mobile, larger on desktop */
    rounded-2xl 
    bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600
    text-white font-black 
    text-[10px] md:text-base /* 👈 Smaller text on tiny screens */
    tracking-[0.1em] md:tracking-[0.2em] /* 👈 Tightened tracking for mobile */
    uppercase
    shadow-[0_20px_40px_-10px_rgba(217,70,239,0.5)] 
    hover:scale-[1.02] active:scale-95 transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
                    <span className="whitespace-nowrap">Add To Calendar</span>
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />{" "}
                    {/* 👈 Responsive icon size */}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #6366f1, #d946ef); 
          border-radius: 10px; 
        }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>
    </div>
  );
};

/* 💎 UPDATED: COMPACT GLOSSY STAT */
const GlossyStat = ({
  icon: Icon,
  label,
  value,
  color,
  onClick,
  isClickable,
}) => (
  <div
    onClick={onClick}
    className={`group flex flex-col items-center justify-center py-3 px-2 rounded-2xl 
      bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/80 dark:border-white/10 
      transition-all duration-500 shadow-md
      ${
        isClickable
          ? "cursor-pointer hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-white/10 active:scale-95"
          : ""
      }`}
  >
    <div
      className={`p-2 rounded-xl bg-gradient-to-br ${color} mb-2 shadow-sm group-hover:scale-110 transition-transform`}
    >
      <Icon size={16} className="text-white" />
    </div>
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 text-center">
      {label}
    </p>
    <p className="text-[11px] font-bold text-center line-clamp-1 w-full text-slate-800 dark:text-white px-1">
      {value}
    </p>
  </div>
);

export default EventDetails;
