import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  Briefcase,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // Helper for consistent link styling
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-rose-50 text-rose-600 border-rose-200 shadow-sm dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 dark:shadow-[0_0_15px_-3px_rgba(225,29,72,0.3)] border"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 border border-transparent"
        }`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 z-[60] transition-all duration-300">
        {/* Glass Background Layer */}
        <div className="absolute inset-0 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm dark:shadow-lg transition-colors duration-300"></div>

        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setOpen(false);
              navigate("/admin/dashboard");
            }}
          >
            {/* ✅ FIXED: Added group-hover:-rotate-12 for subtle left rotation */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 shadow-lg shadow-rose-500/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">
              BVC{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 dark:from-rose-400 dark:to-orange-400 font-black">
                Admin
              </span>
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-md transition-colors">
            <NavItem
              to="/admin/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <NavItem to="/admin/users" icon={Users} label="Users" />
            <NavItem to="/admin/staff" icon={UserCog} label="Staff" />
            <NavItem to="/admin/events" icon={Calendar} label="Events" />
            <NavItem to="/admin/jobs" icon={Briefcase} label="Jobs" />
          </div>

          {/* Desktop Logout Button */}
          <button
            onClick={logout}
            className="hidden md:flex group items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-red-600 dark:to-rose-600 text-white text-sm font-bold shadow-lg transition-all duration-300 border border-white/10 hover:-translate-y-0.5"
          >
            <span>Logout</span>
            <LogOut
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden relative w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-900 dark:text-white transition-all active:scale-90"
            onClick={() => setOpen(!open)}
          >
            <div className="relative w-6 h-6 flex items-center justify-center transition-all duration-300">
              <span
                className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                  open ? "rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                  open ? "opacity-0 translate-x-4" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                  open ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-x-4 top-24 z-50 md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${
          open
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white dark:border-white/5 p-6 overflow-hidden">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  to: "/admin/dashboard",
                  label: "Dashboard",
                  icon: LayoutDashboard,
                  color: "text-rose-500 bg-rose-500/10",
                },
                {
                  to: "/admin/users",
                  label: "Students",
                  icon: Users,
                  color: "text-blue-500 bg-blue-500/10",
                },
                {
                  to: "/admin/staff",
                  label: "Staff",
                  icon: UserCog,
                  color: "text-violet-500 bg-violet-500/10",
                },
                {
                  to: "/admin/events",
                  label: "Events",
                  icon: Calendar,
                  color: "text-orange-500 bg-orange-500/10",
                },
                {
                  to: "/admin/jobs",
                  label: "Jobs",
                  icon: Briefcase,
                  color: "text-emerald-500 bg-emerald-500/10",
                },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                        flex flex-col items-start gap-3 p-4 rounded-3xl transition-all group border
                        ${
                          isActive
                            ? "bg-white dark:bg-white/10 border-rose-200 dark:border-rose-500/30 shadow-sm"
                            : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5"
                        }
                    `}
                >
                  <div
                    className={`p-2.5 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}
                  >
                    <item.icon size={22} />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black hover:bg-red-100 transition-all border border-red-100 dark:border-red-500/10"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
