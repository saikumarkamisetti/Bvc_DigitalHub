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
  CalendarPlus,
  Copy,
} from "lucide-react";

/**
 * MUST MATCH YOUR NAVBAR HEIGHT
 */
const NAVBAR_HEIGHT_MOBILE = 72;
const NAVBAR_HEIGHT_DESKTOP = 88;

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
    toast.info("Location copied");
  };

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-slate-100 dark:bg-[#05070a]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="h-[100dvh] w-full bg-slate-100 text-slate-900 dark:bg-[#05070a] dark:text-white overflow-hidden relative transition-colors">
      <Navbar />

      {/* ✨ Ambient Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/25 blur-[180px]" />
        <div className="absolute -bottom-1/3 right-1/4 w-[450px] h-[450px] bg-fuchsia-500/20 dark:bg-fuchsia-600/25 blur-[180px]" />
      </div>

      <main
        className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-4 flex flex-col min-h-0 mt-3"
        style={{
          paddingTop: NAVBAR_HEIGHT_MOBILE,
          height: `calc(100dvh - ${NAVBAR_HEIGHT_MOBILE}px)`,
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl 
              bg-white/70 dark:bg-white/10 
              backdrop-blur-md 
              border border-slate-200 dark:border-white/10 
              text-xs font-semibold 
              hover:bg-white dark:hover:bg-white/20 
              transition"
          >
            <ArrowLeft
              size={14}
              className="text-indigo-500 dark:text-indigo-400"
            />
            Back
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied");
            }}
            className="p-2 rounded-xl 
              bg-white/70 dark:bg-white/10 
              border border-slate-200 dark:border-white/10 
              hover:bg-white dark:hover:bg-white/20 
              transition"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          {/* LEFT BANNER */}
          <div
            className="lg:col-span-5 min-h-[220px] lg:min-h-0 rounded-2xl overflow-hidden relative 
            border border-slate-200 dark:border-white/10 
            bg-white dark:bg-black 
            shadow-[0_0_50px_rgba(99,102,241,0.25)]"
          >
            <img
              src={event.banner || "https://via.placeholder.com/800"}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles
                  size={12}
                  className="text-indigo-500 dark:text-indigo-400 animate-spin-slow"
                />
                <span className="text-[10px] tracking-widest font-bold text-indigo-600 dark:text-indigo-300">
                  FEATURED EVENT
                </span>
              </div>
              <h1 className="text-xl lg:text-3xl font-black text-white drop-shadow">
                {event.title}
              </h1>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 flex flex-col gap-3 min-h-0">
            {/* INFO */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <InfoBox
                icon={Calendar}
                label="Date"
                value={new Date(event.date).toLocaleDateString()}
                color="indigo"
              />
              <InfoBox
                icon={Clock}
                label="Time"
                value={event.time}
                color="fuchsia"
              />
              <InfoBox
                icon={MapPin}
                label="Venue"
                value={event.location}
                color="cyan"
                onClick={handleCopyLocation}
                isClickable
              />
            </div>

            {/* DESCRIPTION */}
            <div
              className="flex-1 rounded-2xl
  bg-transparent
  backdrop-blur-[22px]
  border border-white/20 dark:border-white/10
  p-4 flex flex-col min-h-0
  shadow-[0_0_40px_rgba(99,102,241,0.25)]
  relative overflow-hidden"
            >
              {/* Glass overlay */}
              <div
                className="absolute inset-0 rounded-2xl 
    bg-white/30 dark:bg-white/5 
    pointer-events-none"
              />

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col min-h-0">
                {/* your existing content stays here */}
              </div>
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <Tag
                  size={12}
                  className="text-indigo-500 dark:text-indigo-400"
                />
                <span className="text-[10px] tracking-widest font-bold text-indigo-600 dark:text-indigo-300">
                  {event.category || "GENERAL"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <p className="text-sm lg:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLocation}
                  className="p-2 rounded-xl 
                    bg-white/70 dark:bg-white/10 
                    border border-slate-200 dark:border-white/10 
                    hover:bg-white dark:hover:bg-white/20 transition"
                >
                  <Copy size={16} />
                </button>

                <button
                  onClick={handleAddToCalendar}
                  className="flex-1 py-2.5 rounded-xl 
                    bg-gradient-to-r from-indigo-600 to-fuchsia-600 
                    font-bold text-xs tracking-widest text-white 
                    hover:scale-[1.02] transition 
                    shadow-[0_0_35px_rgba(99,102,241,0.6)]"
                >
                  ADD TO CALENDAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STYLES */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.6);
          border-radius: 20px;
        }

        @media (min-width: 1024px) {
          main {
            padding-top: ${NAVBAR_HEIGHT_DESKTOP}px !important;
            height: calc(100dvh - ${NAVBAR_HEIGHT_DESKTOP}px) !important;
          }
        }
      `}</style>
    </div>
  );
};

const InfoBox = ({ icon: Icon, label, value, color, onClick, isClickable }) => {
  const colors = {
    indigo: "text-indigo-500 dark:text-indigo-400",
    fuchsia: "text-fuchsia-500 dark:text-fuchsia-400",
    cyan: "text-cyan-500 dark:text-cyan-400",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl 
        bg-white/70 dark:bg-white/10 
        backdrop-blur-md 
        border border-slate-200 dark:border-white/10 
        p-2 transition ${isClickable ? "cursor-pointer active:scale-95" : ""}`}
    >
      <Icon size={14} className={colors[color]} />
      <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </p>
      <p className="text-[11px] font-semibold truncate text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default EventDetails;
