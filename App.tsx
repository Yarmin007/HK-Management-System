
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RequestTracker from './components/RequestTracker';
import InventoryManager from './components/InventoryManager';
import DutyRoster from './components/DutyRoster';
import UserManagement from './components/UserManagement';
import Talk from './components/Talk';
import Studio from './components/Studio';
import Cinematics from './components/Cinematics';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-[#702052] flex items-center justify-center shadow-2xl shadow-[#702052]/30 animate-pulse overflow-hidden">
             {/* Professional Vector Logo Concept for HK */}
             <svg viewBox="0 0 100 100" className="w-16 h-16 text-white fill-none stroke-current" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M25 20 V80 M25 50 H75 M75 20 V80" strokeWidth="10" />
                <path d="M45 40 L55 60" strokeWidth="6" opacity="0.6" />
                <circle cx="50" cy="50" r="15" strokeWidth="4" opacity="0.4" />
             </svg>
          </div>
          <div className="absolute -inset-10 bg-[#702052]/10 rounded-full blur-[60px] animate-pulse"></div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Abdulla Yamin</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em]">HK Coordinator Portal</p>
        </div>
        <div className="w-72 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-[#702052] w-1/3 animate-[loading_1.5s_infinite_ease-in-out]"></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard />;
      case 'requests': return <RequestTracker />;
      case 'inventory': return <InventoryManager />;
      case 'roster': return <DutyRoster />;
      case 'users': return <UserManagement />;
      case 'talk': return <Talk />;
      case 'studio': return <Studio />;
      case 'cinematics': return <Cinematics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-800 overflow-hidden font-['Inter']">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 overflow-y-auto relative bg-[#f8fafc]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#702052]/[0.015] blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
