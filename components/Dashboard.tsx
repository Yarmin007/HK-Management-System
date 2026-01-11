
import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Active Service', value: '18', change: '5 Critical', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[#702052]' },
    { label: 'Room Ready', value: '62%', change: 'Standard Sweep', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-700' },
    { label: 'Inventory Par', value: '142', change: 'Store Low', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-[#702052]' },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Operational Overview</h1>
          <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">Management System Live Intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border-2 border-slate-100 px-8 py-5 rounded-[24px] shadow-sm text-center">
            <div className="text-[9px] font-black text-[#702052] uppercase tracking-[0.3em]">System Health</div>
            <div className="text-slate-900 text-sm font-black uppercase tracking-wider mt-1">Status Nominal</div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <div className={`p-5 bg-slate-50 rounded-[24px] group-hover:bg-[#702052] group-hover:text-white transition-colors ${stat.color}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#702052] bg-purple-50 px-4 py-2 rounded-full">{stat.change}</span>
            </div>
            <div className="mt-10 relative z-10">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
              <h3 className="text-5xl font-black text-slate-900 mt-2">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Priority List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-10 rounded-[48px] shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Priority Queue</h3>
            <button className="bg-slate-50 text-slate-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-[#702052] transition-colors">Audit Board</button>
          </div>
          <div className="space-y-6">
            {[
              { room: 'Villa 04', item: 'Minibar Audit', time: '5m wait', priority: 'high' },
              { room: 'Villa 18', item: 'Extra Linen Pack', time: '12m wait', priority: 'medium' },
              { room: 'Villa 72', item: 'Deep Clean Req', time: '15m wait', priority: 'standard' },
            ].map((req, i) => (
              <div key={i} className="flex gap-8 items-center bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 group hover:bg-white hover:border-[#702052]/30 transition-all cursor-pointer">
                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-2xl ${req.priority === 'high' ? 'bg-red-50 text-red-700 shadow-lg shadow-red-900/10' : 'bg-slate-100 text-slate-700'}`}>
                  {req.room.split(' ')[1]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-black text-slate-900 uppercase">{req.room}</p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{req.item}</p>
                </div>
                <button className="bg-white border-2 border-slate-100 hover:border-[#702052] hover:text-[#702052] text-slate-900 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">Assign</button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Call-to-Action */}
        <div className="bg-[#702052] p-12 rounded-[56px] flex flex-col items-center justify-center text-center space-y-10 shadow-2xl shadow-[#702052]/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-20"></div>
          <div className="w-28 h-28 rounded-[32px] bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center relative z-10 animate-pulse">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="text-white relative z-10">
            <h3 className="text-4xl font-black uppercase tracking-tight">AI Dispatch</h3>
            <p className="text-[11px] text-white/70 mt-6 font-bold leading-relaxed uppercase tracking-[0.2em]">Speak to the system for instant floor updates and service logging.</p>
          </div>
          <button className="w-full py-6 bg-white text-[#702052] rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 shadow-2xl relative z-10 active:scale-95">
            Begin Voice Command
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
