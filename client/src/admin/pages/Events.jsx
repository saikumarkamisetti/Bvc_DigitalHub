import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  X,
  Save,
  ImageIcon,
  Sparkles,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import adminAPI from "../../services/adminApi";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "General",
    bannerFile: null,
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.get("/admin/events");
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (eventToEdit = null) => {
    if (eventToEdit) {
      const dateStr = eventToEdit.date
        ? new Date(eventToEdit.date).toISOString().split("T")[0]
        : "";

      setFormData({
        title: eventToEdit.title,
        date: dateStr,
        time: eventToEdit.time,
        location: eventToEdit.location,
        description: eventToEdit.description,
        category: eventToEdit.category || "General",
        bannerFile: null,
      });
      setIsEditingId(eventToEdit._id);
    } else {
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "General",
        bannerFile: null,
      });
      setIsEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== "bannerFile") data.append(k, v);
      });
      if (formData.bannerFile) data.append("banner", formData.bannerFile);

      if (isEditingId) {
        await adminAPI.put(`/admin/events/${isEditingId}`, data);
        toast.success("Event updated! 🚀");
      } else {
        await adminAPI.post("/admin/events", data);
        toast.success("Event created! 🎉");
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      toast.error("Operation failed.");
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeletingLocal(true);
    try {
      await adminAPI.delete(`/admin/events/${eventToDelete._id}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
      toast.success("Event deleted.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setIsDeletingLocal(false);
      setEventToDelete(null);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-violet-500/30 transition-colors duration-300 relative overflow-x-hidden">
      <AdminNavbar />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
        .scale-in-center { animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Background Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light" />
        <div className="absolute top-0 -left-40 w-[800px] h-[800px] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 -right-40 w-[800px] h-[800px] bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-300 tracking-tight flex items-center gap-4 mb-2">
              <CalendarDays className="w-12 h-12 text-violet-500" />
              Events Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium max-w-xl">
              Manage and organize upcoming campus activities.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="group relative overflow-hidden rounded-2xl py-4 px-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              Create New Event
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="sticky top-24 z-30 mb-10 p-2 rounded-[1.5rem] bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg">
          <div className="relative group">
            <Search className="absolute left-5 top-4 w-6 h-6 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            <input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={() => handleOpenModal(event)}
                onDelete={() => {
                  setEventToDelete(event);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <Sparkles className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500">
              No Upcoming Events
            </h3>
          </div>
        )}
      </main>

      {showModal && (
        <EventModal
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
                Cancel Event?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  "{eventToDelete?.title}"
                </span>
                ?
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  disabled={isDeletingLocal}
                  onClick={confirmDeleteEvent}
                  className="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold transition-all hover:bg-rose-700 hover:scale-[1.02] shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                >
                  {isDeletingLocal ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Yes, Delete Event
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

/* ================= COMPONENT: Event Card ================= */
const EventCard = ({ event, onEdit, onDelete }) => {
  const dateObj = new Date(event.date);
  const month = dateObj
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  return (
    <div className="group relative bg-white dark:bg-[#161b22]/60 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20 flex flex-col h-full">
      <div className="h-52 relative overflow-hidden shrink-0">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090c10] via-transparent to-transparent opacity-80" />

        {/* ✅ FIXED FANCY GLOSSY DATE BADGE (Light & Dark Mode Compatible) */}
        <div className="absolute top-4 left-4 z-20 group/date">
          <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/60 backdrop-blur-2xl border border-slate-200 dark:border-white/20 p-3 min-w-[75px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-2xl transition-all duration-500 group-hover/date:scale-110 group-hover/date:border-indigo-500/50">
            {/* Glossy Top Surface Shine */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/40 dark:from-white/10 to-transparent pointer-events-none" />

            <span className="relative block text-[10px] font-black tracking-[0.25em] text-indigo-600 dark:text-indigo-300 uppercase mb-1">
              {month}
            </span>
            <span className="relative block text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter drop-shadow-sm">
              {day}
            </span>
          </div>
        </div>

        {event.category && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest z-10 shadow-lg">
            {event.category}
          </span>
        )}
      </div>

      <div className="p-6 pt-8 flex flex-col flex-1 relative z-10 -mt-10 rounded-t-[2.5rem] bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {event.title}
        </h3>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-violet-500" />
            {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
            <MapPin className="w-4 h-4 text-fuchsia-500" />
            {event.location}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {event.description}
        </p>
        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/10 relative z-30">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold hover:bg-white dark:hover:bg-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold hover:bg-white dark:hover:bg-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENT: Event Modal ================= */
const EventModal = ({
  isEditing,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) =>
    setFormData((prev) => ({ ...prev, bannerFile: e.target.files[0] }));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 flex justify-center pt-28 px-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#161b22] backdrop-blur-2xl rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/20 flex flex-col h-[85vh]">
        <div className="h-24 bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center px-8 shrink-0">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            {isEditing ? <Edit2 /> : <Sparkles />}{" "}
            {isEditing ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="p-8 overflow-y-auto custom-scrollbar space-y-6"
        >
          <GlassInput
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-6">
            <GlassInput
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <GlassInput
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <GlassInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              icon={MapPin}
            />
            <div className="group space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none"
              >
                {["General", "Academic", "Cultural", "Workshop", "Sports"].map(
                  (c) => (
                    <option key={c} value={c} className="dark:bg-[#161b22]">
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
          <div className="group space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
              required
            />
          </div>
          <div className="group space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
              Banner
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-[#0d1117]/30 hover:bg-violet-50 dark:hover:bg-violet-900/10 cursor-pointer">
              <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-bold text-violet-500">
                {formData.bannerFile
                  ? formData.bannerFile.name
                  : "Select Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-lg shadow-xl flex items-center justify-center gap-2"
          >
            <Save size={20} /> {isEditing ? "Update" : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
};

const GlassInput = ({ label, icon: Icon, ...props }) => (
  <div className="group space-y-2">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-violet-500" />
      )}
      <input
        {...props}
        className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
          Icon ? "pl-12" : ""
        }`}
      />
    </div>
  </div>
);

export default Events;
