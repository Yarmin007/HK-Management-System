
import React, { useState, useMemo } from 'react';
import { HousekeepingRequest, Priority, RequestCategory, RequestStatus } from '../types';

const VILLAS = Array.from({ length: 97 }, (_, i) => `Villa ${String(i + 1).padStart(2, '0')}`);

/**
 * Categorization Logic:
 * Jetty A: 1 to 35
 * Jetty B: 37 to 50
 * Jetty C: 59 to 79
 * Beach: All other numbers (including 36, 51-58, 80-97)
 */
const getLocation = (villaStr: string): 'Jetty A' | 'Jetty B' | 'Jetty C' | 'Beach' => {
  const num = parseInt(villaStr.replace('Villa ', ''), 10);
  if (num >= 1 && num <= 35) return 'Jetty A';
  if (num >= 37 && num <= 50) return 'Jetty B';
  if (num >= 59 && num <= 79) return 'Jetty C';
  return 'Beach';
};

const MINIBAR_ITEMS = [
  'Coke', 'Sprite', 'Diet Coke', 'Soda Water', 'Tonic', 'Beer (Local)', 'Beer (Premium)', 
  'Gin (50ml)', 'Whiskey (50ml)', 'Vodka (50ml)', 'Chips', 'Chocolate', 'Nuts', 'Juice (Orange)'
];

const ATTENDANTS = ['Elena Rodriguez', 'Marcus Thorne', 'Sarah Miller', 'David Smith', 'James Wong', 'Anaya Kumar'];
const ALLOCATIONS: Record<string, string> = {};
VILLAS.forEach((villa, idx) => {
  ALLOCATIONS[villa] = ATTENDANTS[Math.floor(idx / 16) % ATTENDANTS.length];
});

const getAttendant = (villa: string) => ALLOCATIONS[villa] || 'Duty Team';

const RequestTracker: React.FC = () => {
  const [currentAdmin] = useState("Abdulla Yamin");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedJettyFilter, setSelectedJettyFilter] = useState<'all' | 'Jetty A' | 'Jetty B' | 'Jetty C' | 'Beach'>('all');

  const [requests, setRequests] = useState<HousekeepingRequest[]>([
    {
      id: 'mock-carry-over',
      roomNumber: 'Villa 12',
      attendantName: getAttendant('Villa 12'),
      requestType: 'Extra Towels & Bathrobe',
      category: 'general',
      priority: 'high',
      status: 'received',
      timestamp: new Date().setDate(new Date().getDate() - 1),
      createdBy: 'Abdulla Yamin'
    },
    {
      id: 'mock-today',
      roomNumber: 'Villa 42',
      attendantName: getAttendant('Villa 42'),
      requestType: 'Minibar Audit',
      category: 'minibar',
      minibarItems: [
        { name: 'Coke', isPosted: false, isSent: false },
        { name: 'Beer (Local)', isPosted: false, isSent: false }
      ],
      priority: 'medium',
      status: 'received',
      timestamp: Date.now(),
      createdBy: 'Abdulla Yamin'
    }
  ]);

  const [showModal, setShowModal] = useState<RequestCategory | null>(null);
  const [activeItemManager, setActiveItemManager] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');

  // Creation State
  const [selectedVilla, setSelectedVilla] = useState(VILLAS[0]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [generalTask, setGeneralTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  const handleAddRequest = () => {
    const newReq: HousekeepingRequest = {
      id: Math.random().toString(36).substr(2, 9),
      roomNumber: selectedVilla,
      attendantName: getAttendant(selectedVilla),
      requestType: showModal === 'minibar' ? 'Minibar Restock' : generalTask,
      category: showModal!,
      minibarItems: showModal === 'minibar' ? selectedItems.map(name => ({ name, isPosted: false, isSent: false })) : undefined,
      priority: selectedPriority,
      status: 'received',
      timestamp: Date.now(),
      createdBy: currentAdmin
    };
    setRequests([newReq, ...requests]);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(null);
    setSelectedItems([]);
    setGeneralTask('');
  };

  const bulkPost = (reqId: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      const updatedItems = req.minibarItems?.map(item => ({ ...item, isPosted: true }));
      let newStatus: RequestStatus = 'posted_only';
      if (updatedItems?.every(i => i.isSent || i.isUnavailable)) newStatus = 'completed';
      return { ...req, minibarItems: updatedItems, status: newStatus };
    }));
  };

  const bulkSend = (reqId: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      const updatedItems = req.minibarItems?.map(item => ({ ...item, isSent: true }));
      let newStatus: RequestStatus = 'sent_only';
      if (updatedItems?.every(i => i.isPosted)) newStatus = 'completed';
      return { ...req, minibarItems: updatedItems, status: newStatus };
    }));
  };

  const filteredRequests = useMemo(() => {
    const startOfSelected = new Date(selectedDate).setHours(0,0,0,0);
    const endOfSelected = new Date(selectedDate).setHours(23,59,59,999);

    return requests.filter(req => {
      const isIncomplete = req.status !== 'completed';
      const isCarryOver = req.timestamp < startOfSelected && isIncomplete;
      const isCorrectDate = req.timestamp >= startOfSelected && req.timestamp <= endOfSelected;
      
      const dateMatch = isCorrectDate || isCarryOver;
      const statusMatch = filterStatus === 'all' || req.status === filterStatus;
      const jettyMatch = selectedJettyFilter === 'all' || getLocation(req.roomNumber) === selectedJettyFilter;
      
      return dateMatch && statusMatch && jettyMatch;
    });
  }, [requests, selectedDate, filterStatus, selectedJettyFilter]);

  const getStatusDisplay = (req: HousekeepingRequest) => {
    const isPastDue = req.timestamp < new Date().setHours(0,0,0,0) && req.status !== 'completed';
    switch (req.status) {
      case 'received': return { label: isPastDue ? 'OVERDUE' : 'RECEIVED', color: isPastDue ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'posted_only': return { label: 'POSTED', color: 'bg-purple-50 text-purple-700 border-purple-100' };
      case 'sent_only': return { label: 'SENT', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'completed': return { label: 'COMPLETED', color: 'bg-slate-900 text-white' };
      default: return { label: req.status, color: 'bg-slate-50 text-slate-400' };
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1700px] mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-[#702052] flex items-center justify-center shadow-2xl shadow-[#702052]/20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-none stroke-current" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M25 20 V80 M25 50 H75 M75 20 V80" strokeWidth="10" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Service Hub</h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#702052]"></span>
              Lead Coordinator: {currentAdmin}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Date Selector */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl focus-within:border-[#702052] transition-all">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowModal('minibar')} className="bg-[#702052] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#702052]/20 hover:scale-105 transition-all">
              Log Minibar
            </button>
            <button onClick={() => setShowModal('general')} className="bg-white border-2 border-slate-100 text-[#702052] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#702052] transition-all">
              Log Service
            </button>
          </div>
        </div>
      </header>

      {/* Sorting Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto bg-white p-2 rounded-2xl border border-slate-50">
          {(['all', 'Jetty A', 'Jetty B', 'Jetty C', 'Beach'] as const).map(j => (
            <button
              key={j}
              onClick={() => setSelectedJettyFilter(j)}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${
                selectedJettyFilter === j 
                ? 'bg-[#702052] text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['all', 'received', 'posted_only', 'sent_only', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                filterStatus === s 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Request Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredRequests.map(req => {
          const status = getStatusDisplay(req);
          const location = getLocation(req.roomNumber);
          const isCarryOver = req.timestamp < new Date(selectedDate).setHours(0,0,0,0);

          return (
            <div 
              key={req.id} 
              className={`bg-white border rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col relative group overflow-hidden ${
                isCarryOver && req.status !== 'completed' ? 'border-red-400 ring-2 ring-red-500/10 bg-red-50/10' : 'border-slate-100'
              }`}
            >
              {isCarryOver && req.status !== 'completed' && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[7px] font-black px-4 py-2 rounded-bl-xl z-10 uppercase tracking-widest">
                  Carry Over Pending
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none">{req.roomNumber.split(' ')[1]}</h3>
                  <p className="text-[9px] font-black text-[#702052] uppercase tracking-[0.2em] mt-1.5 italic">{location}</p>
                </div>
                <span className={`text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="mb-6 flex-grow space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Personnel:</p>
                    <p className="text-[9px] font-black text-slate-900 uppercase">{req.attendantName}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logged By:</p>
                    <p className="text-[9px] font-black text-[#702052] uppercase italic">{req.createdBy}</p>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 min-h-[90px] flex flex-col">
                  <p className="font-bold text-slate-800 text-[11px] leading-relaxed uppercase tracking-tight">{req.requestType}</p>
                  {req.minibarItems && (
                    <div className="mt-auto pt-3 space-y-1.5">
                      {req.minibarItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[8px] font-bold">
                          <span className="text-slate-500 uppercase truncate max-w-[100px]">{item.name}</span>
                          <div className="flex gap-2">
                            <span className={item.isPosted ? 'text-purple-600' : 'text-slate-300'}>POST</span>
                            <span className={item.isSent ? 'text-emerald-600' : 'text-slate-300'}>SENT</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => bulkPost(req.id)}
                  disabled={req.status === 'completed' || req.status === 'posted_only'}
                  className="py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-600 hover:text-white transition-all disabled:opacity-30"
                >
                  Post All
                </button>
                <button 
                  onClick={() => bulkSend(req.id)}
                  disabled={req.status === 'completed' || req.status === 'sent_only'}
                  className="py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-30"
                >
                  Send All
                </button>
                <button 
                  onClick={() => setActiveItemManager(req.id)}
                  className="col-span-2 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#702052] transition-colors shadow-lg"
                >
                  Manage Details
                </button>
              </div>
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[48px]">
            <p className="text-slate-300 font-black text-sm uppercase tracking-widest italic">All registries clear for this selection</p>
            <p className="text-slate-200 text-[10px] uppercase font-black mt-2">Check different dates or jetty locations</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#702052] p-10 flex justify-between items-center text-white">
              <div>
                <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none">Registry Entry</h2>
                <p className="text-white/50 text-[10px] font-black uppercase mt-2">Lead: {currentAdmin}</p>
              </div>
              <button onClick={closeModal} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Villa Registry</label>
                   <select value={selectedVilla} onChange={e => setSelectedVilla(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 text-sm focus:border-[#702052] outline-none transition-all">
                     {VILLAS.map(v => <option key={v} value={v}>{v} ({getLocation(v)})</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Allocated Personnel</label>
                   <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-black text-[#702052] text-sm italic">{getAttendant(selectedVilla)}</div>
                 </div>
               </div>

               {showModal === 'minibar' ? (
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Stock Manifest</label>
                    <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-3 scrollbar-hide">
                      {MINIBAR_ITEMS.map(item => (
                        <button key={item} onClick={() => setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])} className={`px-4 py-5 rounded-2xl text-[9px] font-black uppercase border-2 transition-all ${selectedItems.includes(item) ? 'bg-[#702052]/5 border-[#702052] text-[#702052]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                 </div>
               ) : (
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Service Summary</label>
                    <textarea value={generalTask} onChange={e => setGeneralTask(e.target.value)} placeholder="Describe the task..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-slate-900 text-sm min-h-[140px] focus:border-[#702052] outline-none transition-all" />
                 </div>
               )}

               <button onClick={handleAddRequest} className="w-full bg-[#702052] text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-[#702052]/30 active:scale-[0.98] transition-all">Authorize & Log Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTracker;
