import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Search,
  Music,
} from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/info/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err))
      .finally(() => setLoading(false));
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      [event.title, event.category, event.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  return (
    // UPDATED: Added bg-slate-50 for light mode and text color toggle
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0C15] text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* --- BACKGROUND GLOW & GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern: Subtle gray for light mode, dark blue for dark mode */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#23263a_1px,transparent_1px),linear-gradient(to_bottom,#23263a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-500/20 dark:bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 px-6 pb-20">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* Glossy Badge: Adjusted for light/dark visibility */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
            <Zap size={14} className="fill-purple-600 dark:fill-purple-400" />{" "}
            Campus Life
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-500 dark:to-rose-500">
              Events
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover workshops, cultural fests, and tech symposiums.{" "}
            <br className="hidden md:block" />
            Don't miss out on what's happening around you.
          </p>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="relative max-w-2xl mx-auto mb-20 group">
          {/* Glow behind search */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

          {/* Input Container: White for light mode, Dark for dark mode */}
          <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/80 dark:bg-[#13151f]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
            <Search
              size={22}
              className="text-slate-400 dark:text-slate-500 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, locations, or vibes..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none text-lg font-medium"
            />
          </div>
        </div>

        {/* ================= EVENTS GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[450px] rounded-[2.5rem] bg-slate-200 dark:bg-white/5 border border-transparent dark:border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

/* ================= GLOSSY EVENT CARD ================= */
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const dateObj = new Date(event.date);
  const month = dateObj
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  return (
    // ✅ ADDED onClick and cursor-pointer to the main wrapper
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="group relative cursor-pointer bg-white dark:bg-[#181a25] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.2)] flex flex-col h-full"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-64 overflow-hidden">
        {/* ✅ FIXED DATE STICKER: Solid background and high contrast text */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 transition-transform group-hover:scale-105">
          <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            {month}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
            {day}
          </span>
        </div>

        {/* Image Overlay Gradient: Darker at bottom to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />

        {/* Image */}
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 group-hover:scale-110 transition-transform duration-700">
            <div className="flex items-center justify-center h-full opacity-30 text-white">
              <Music size={64} />
            </div>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="relative z-20 p-8 pt-4 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>
        </div>

        {/* Meta Data Pills: Slate-100 for light, White/5 for dark */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Clock size={14} className="text-pink-500" /> {event.time}
          </div>
          {/* ✅ UPDATED: Location pill now links to Google Maps */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              event.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevents the card's onClick from triggering
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <MapPin size={14} className="text-purple-500" /> {event.location}
          </a>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-8 leading-relaxed font-medium">
          {event.description}
        </p>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering the parent div's onClick twice
            navigate(`/events/${event._id}`);
          }}
          className="mt-auto w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center gap-3 group/btn"
        >
          View Details
          <ArrowRight
            size={18}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

/* ================= EMPTY STATE ================= */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="relative w-24 h-24 mb-6">
      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="relative w-full h-full bg-white dark:bg-[#181a25] rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-purple-500 dark:text-purple-400" />
      </div>
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
      No Events Found
    </h3>
    <p className="text-slate-500 max-w-xs mx-auto">
      We couldn't find any events matching your search. Try looking for
      something else?
    </p>
  </div>
);

export default Events;
