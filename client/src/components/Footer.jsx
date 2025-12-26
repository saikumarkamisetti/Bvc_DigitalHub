import React from "react";
import { toast } from "react-toastify";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGlobe,
  FaRocket,
  FaXTwitter, // Added for the X (Twitter) icon
} from "react-icons/fa6"; // Note: Using fa6 for the most updated X icon

const Footer = () => {
  // Handler for the Newsletter Join button
  const handleJoin = (e) => {
    e.preventDefault();
    toast.success("You have joined successfully!", {
      className: "dark:bg-[#161b22] dark:text-white rounded-xl font-bold",
    });
  };

  // Social Links Data - Add your new link here
  const socialLinks = [
    {
      icon: FaLinkedinIn,
      url: "https://www.linkedin.com/school/bvcec-odalarevu/",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/bvcengineeringcollegeodalarevu/",
    },
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/bvcengineeringcollegeodalarevu/",
    },
    { icon: FaXTwitter, url: "https://x.com/BvcColleges" }, // New link added
    { icon: FaGlobe, url: "https://bvcec.edu.in/" },
  ];

  return (
    <footer className="relative w-full pt-20 pb-10 overflow-hidden bg-white dark:bg-[#05070a] transition-colors duration-500">
      {/* --- BACKGROUND AMBIENT GLOW EFFECTS --- */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[128px] translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Column 1: Brand */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-lg shadow-lg">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-black tracking-wider text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-cyan-300 dark:to-indigo-400">
                  BVC DIGITAL HUB
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pr-4">
                The ultimate digital campus workspace. Access projects, connect
                with faculty, and discover opportunities in one unified, glossy
                hub.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm border-b border-indigo-500 w-fit pb-1">
                Platform
              </h3>
              <ul className="space-y-3">
                {["Projects", "Staff", "Events", "Jobs"].map((item) => (
                  <li key={item}>
                    <div className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-300 transition-all text-sm flex items-center group cursor-default">
                      <span className="w-0 h-[2px] bg-indigo-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all"></span>
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Newsletter */}
            <div className="md:col-span-6 space-y-6">
              <h3 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm">
                Stay in the loop
              </h3>
              <form onSubmit={handleJoin} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative flex items-stretch bg-white dark:bg-black/60 rounded-xl backdrop-blur-xl border border-slate-200 dark:border-white/10 overflow-hidden p-1">
                  <input
                    required
                    type="email"
                    placeholder="Enter email for updates"
                    className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-500 pl-4 py-3 flex-grow w-full text-sm"
                  />
                  <button
                    type="submit"
                    className="ml-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-sm font-bold tracking-wide transition-all hover:shadow-lg active:scale-95"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="my-12 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} BVC Digital Hub. Built with ❤️
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-fuchsia-600 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative z-10 w-full h-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                    <social.icon className="text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 dark:group-hover:text-white transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
