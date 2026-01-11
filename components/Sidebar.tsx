
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const SidebarActual: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'requests', label: 'Service Hub', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'inventory', label: 'Stock Control', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'roster', label: 'Duty Roster', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'users', label: 'Team Mgmt', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'talk', label: 'AI Voice', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  ];

  return (
    <div className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-20 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#702052] flex items-center justify-center shadow-xl shadow-[#702052]/20 relative shrink-0">
          {/* Professional Vector Logo Concept for HK */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-none stroke-current" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 20 V80 M25 50 H75 M75 20 V80" strokeWidth="10" />
            <path d="M45 40 L55 60" strokeWidth="6" opacity="0.6" />
            <circle cx="50" cy="50" r="15" strokeWidth="4" opacity="0.4" />
          </svg>
        </div>
        <div className="hidden md:block">
          <h2 className="font-black text-[11px] leading-tight tracking-tight text-slate-900 uppercase">HK Coordinator</h2>
          <p className="text-[10px] font-black text-[#702052] uppercase leading-tight italic">Abdulla Yamin</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-[#702052] text-white shadow-lg shadow-[#702052]/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-[#702052]'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="hidden md:flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abdulla" className="w-10 h-10 rounded-full border-2 border-white bg-white shadow-sm" alt="Abdulla Yamin" />
          <div className="overflow-hidden">
            <p className="text-[10px] font-black truncate text-slate-800 uppercase">Abdulla Yamin</p>
            <p className="text-[9px] text-[#702052] uppercase font-black tracking-wider">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarActual;
