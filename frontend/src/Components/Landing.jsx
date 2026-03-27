import React from "react";
import { Search, PlusCircle, ShieldCheck, ArrowRight } from "lucide-react";

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Search className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 underline decoration-blue-500">
            CampusRetriever
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-200"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Lost it? <span className="text-blue-600 italic">Found it.</span>{" "}
          <br />
          Resolved it.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The central hub for reporting, tracking, and recovering misplaced
          belongings on campus. A structured workflow designed for students,
          security, and administration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200"
          >
            Report an Item <PlusCircle size={20} />
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-300 transition">
            Browse Gallery <ArrowRight size={20} />
          </button>
        </div>
      </header>

      {/* Features / Roles Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Search className="text-blue-600" />}
            title="For Students"
            description="Easily browse the found items gallery or report something you lost in seconds."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-green-600" />}
            title="For Staff"
            description="Verify claims, manage the inventory, and ensure items get back to their rightful owners."
          />
          <FeatureCard
            icon={<PlusCircle className="text-purple-600" />}
            title="For Admin"
            description="Monitor recovery rates and manage campus-wide lost and found logistics."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-slate-400 text-sm">
        © 2026 CampusRetriever System • Built for better recoverability.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center space-y-4 p-4 hover:transform hover:-translate-y-1 transition duration-300">
    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
