import { useNavigate } from "react-router-dom"; // ✅ Added import
import Navbar from "../components/Navbar";

const Landing = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* PUSH CONTENT BELOW FIXED NAVBAR */}
      <main className="relative z-10 pt-28">
        {/* ================= HERO SECTION ================= */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT CONTENT */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
              {/* Modern Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-[#161b22]/50 border border-indigo-200 dark:border-indigo-900/50 backdrop-blur-md shadow-sm hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  New Portal for 2025
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Elevating the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400">
                  BVC Experience
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A centralized{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  digital ecosystem
                </span>{" "}
                for BVC students. Showcase innovation, connect with faculty, and
                accelerate your career path with next-gen tools.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="/signup"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
                <a
                  href="/login"
                  className="px-8 py-4 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1c2128] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-sm flex items-center justify-center"
                >
                  Log In
                </a>
              </div>

              {/* Stats */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>500+ Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>100% Digital</span>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE AREA */}
            <div className="relative flex justify-center items-center perspective-1000">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-[60px] rounded-full animate-pulse-slow" />

              <div className="relative group transform transition-all duration-500 hover:scale-[1.02] hover:rotate-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                <div className="relative bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-4 shadow-2xl">
                  <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0d1117] relative aspect-[4/3] flex items-center justify-center">
                    <img
                      src="/bvc.png"
                      alt="BVC Digital Campus"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.innerHTML = `<div class="text-center p-10"><span class="text-6xl">🎓</span><p class="mt-4 font-bold text-slate-400">BVC Digital Hub</p></div>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white font-bold">
                        Explore Campus Life
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="py-32 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 px-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Everything you need to{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                excel
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Tools built specifically for engineering students to bridge the
              gap between academia and industry.
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ✅ Added onClick handlers to redirect to Login */}
            <FeatureCard
              icon="🚀"
              title="Student Projects"
              desc="Showcase your academic innovation. Upload code, demos, and documentation to build a portfolio that stands out."
              gradient="from-blue-500 to-cyan-500"
              onClick={() => navigate("/login")}
            />
            <FeatureCard
              icon="⚡"
              title="Faculty & Events"
              desc="Direct connection with mentors. Stay updated on workshops, hackathons, and departmental seminars."
              gradient="from-violet-500 to-purple-500"
              onClick={() => navigate("/login")}
            />
            <FeatureCard
              icon="💎"
              title="Placements"
              desc="Real-time tracking of hiring drives. Access preparation materials and track your application status instantly."
              gradient="from-fuchsia-500 to-pink-500"
              onClick={() => navigate("/login")}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

// ✅ Updated component to handle onClick and cursor-pointer
const FeatureCard = ({ icon, title, desc, gradient, onClick }) => (
  <div
    onClick={onClick}
    className="group relative cursor-pointer bg-white dark:bg-[#161b22] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
  >
    {/* Hover Gradient Background */}
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-500 -mr-10 -mt-10`}
    />

    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-[1px] mb-6 shadow-lg`}
    >
      <div className="w-full h-full bg-white dark:bg-[#161b22] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>

    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default Landing;
