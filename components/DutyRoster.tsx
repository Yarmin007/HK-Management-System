import React from 'react';

const DutyRoster: React.FC = () => {
  const shifts = [
    { floor: 'Level 1', attendant: 'Elena Rodriguez', status: 'In Service', progress: 65 },
    { floor: 'Level 2', attendant: 'Marcus Thorne', status: 'Ready', progress: 0 },
    { floor: 'Level 3', attendant: 'Sarah Miller', status: 'Complete', progress: 100 },
    { floor: 'Floor 4', attendant: 'David Smith', status: 'On Break', progress: 40 },
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Staff Deployment</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Personnel Tracking & Floor Coverage</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <button className="px-8 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">Archive</button>
           <button className="bg-[#702052] px-8 py-3 rounded-xl text-[10px] font-black uppercase text-white shadow-xl shadow-[#702052]/20 transition-all">Current Shift</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {shifts.map((shift, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[40px] p-10 relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="absolute top-0 right-0 p-6">
              <span className={`text-[8px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${
                shift.status === 'Complete' ? 'bg-emerald-50 text-emerald-700' : 
                shift.status === 'On Break' ? 'bg-slate-100 text-slate-500' : 'bg-purple-50 text-[#702052]'
              }`}>
                {shift.status}
              </span>
            </div>
            
            <h4 className="text-[#702052] text-[10px] font-black uppercase tracking-[0.3em] mb-3">{shift.floor}</h4>
            <h3 className="text-2xl font-black text-slate-900">{shift.attendant}</h3>
            
            <div className="mt-10 space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <span>Task Flow</span>
                <span className="text-slate-900">{shift.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className="bg-[#702052] h-3 rounded-full transition-all duration-1000 shadow-sm" 
                  style={{ width: `${shift.progress}%` }}
                ></div>
              </div>
            </div>
            
            <button className="w-full mt-12 py-4 bg-slate-50 group-hover:bg-[#702052] group-hover:text-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              Personnel Detail
            </button>
          </div>
        ))}

        <button className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-10 flex flex-col items-center justify-center text-slate-400 hover:text-[#702052] hover:border-[#702052] transition-all group shadow-sm">
          <div className="w-20 h-20 rounded-full bg-slate-50 group-hover:bg-purple-50 flex items-center justify-center mb-6 transition-colors">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Deploy Staff</span>
        </button>
      </div>
    </div>
  );
};

export default DutyRoster;