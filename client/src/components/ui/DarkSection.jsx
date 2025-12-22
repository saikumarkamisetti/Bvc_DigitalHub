const DarkSection = ({ children }) => {
  return (
    <section className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {children}
      </div>
    </section>
  );
};

export default DarkSection;
