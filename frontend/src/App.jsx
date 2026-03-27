import React, { useState } from "react";
import {
  Search,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Lock,
  User,
  Shield,
} from "lucide-react";

// --- SUB-COMPONENT: Landing Page ---
const LandingPage = ({ onEnter }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
    <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Search size={20} />
        </div>
        <span className="text-xl font-bold text-slate-800">
          CampusRetriever
        </span>
      </div>
      <button
        onClick={onEnter}
        className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition"
      >
        Enter System
      </button>
    </nav>

    <header className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
        Lost it? <span className="text-blue-600">Found it.</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
        The official campus system for reporting, tracking, and resolving lost
        items with full accountability.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onEnter}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
        >
          Report Lost Item
        </button>
        <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-300 transition">
          View Found Gallery
        </button>
      </div>
    </header>
  </div>
);

// --- SUB-COMPONENT: Role Selection (The "Login" gate) ---
const RoleSelection = ({ onBack }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    <button
      onClick={onBack}
      className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 underline text-sm"
    >
      ← Back to Welcome
    </button>
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900">Choose Your Access</h2>
      <p className="text-slate-500">
        Please select your role to continue to the dashboard.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
      <RoleCard
        icon={<User size={32} />}
        title="Student Side"
        color="blue"
        desc="Report lost items & claim found ones."
      />
      <RoleCard
        icon={<ShieldCheck size={32} />}
        title="Staff Side"
        color="green"
        desc="Verify claims & manage storage."
      />
      <RoleCard
        icon={<Shield size={32} />}
        title="Admin Side"
        color="purple"
        desc="System analytics & user control."
      />
    </div>
  </div>
);

const RoleCard = ({ icon, title, color, desc }) => (
  <button
    className={`p-8 rounded-2xl border-2 border-slate-100 hover:border-${color}-500 transition-all text-left group hover:shadow-xl`}
  >
    <div
      className={`text-${color}-600 mb-4 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </button>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState("landing"); // 'landing' or 'roles'

  return (
    <main>
      {view === "landing" ? (
        <LandingPage onEnter={() => setView("roles")} />
      ) : (
        <RoleSelection onBack={() => setView("landing")} />
      )}
    </main>
  );
}
