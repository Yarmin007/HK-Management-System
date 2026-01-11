
import React, { useState } from 'react';
import { User, UserRole } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Abdulla Yamin', role: 'coordinator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdulla' },
    { id: '2', name: 'Elena Rodriguez', role: 'attendant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { id: '3', name: 'Marcus Thorne', role: 'supervisor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('attendant');

  const handleAddUser = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      role: newRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setNewName('');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Team Management</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Assign roles and access levels</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#702052] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#702052]/20"
        >
          Add Staff
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white border border-slate-100 rounded-[32px] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-white ${
              user.role === 'coordinator' ? 'bg-[#702052]' : user.role === 'supervisor' ? 'bg-purple-600' : 'bg-slate-400'
            }`}>
              {user.role}
            </div>
            <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-slate-50 bg-slate-50 mb-4" alt={user.name} />
            <h3 className="text-lg font-black text-slate-900 uppercase">{user.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{user.role === 'coordinator' ? 'System Owner' : 'Service Team'}</p>
            <div className="mt-6 flex gap-2 w-full">
               <button className="flex-1 py-2 rounded-xl border border-slate-100 text-[8px] font-black uppercase hover:bg-slate-50">Edit</button>
               {user.id !== '1' && <button className="flex-1 py-2 rounded-xl border border-red-50 text-red-400 text-[8px] font-black uppercase hover:bg-red-50">Revoke</button>}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
             <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">Register Personnel</h2>
             <div className="space-y-6">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                 <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-900 text-sm outline-none focus:border-[#702052]" 
                  placeholder="e.g. John Doe"
                 />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assign Role</label>
                 <select 
                  value={newRole} 
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-900 text-sm outline-none focus:border-[#702052]"
                 >
                   <option value="attendant">Room Attendant</option>
                   <option value="supervisor">Floor Supervisor</option>
                   <option value="coordinator">HK Coordinator</option>
                 </select>
               </div>
               <button 
                onClick={handleAddUser}
                className="w-full py-6 bg-[#702052] text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#702052]/20 mt-4"
               >
                 Confirm Addition
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
