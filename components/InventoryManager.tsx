import React, { useState } from 'react';
import { InventoryItem } from '../types';

const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Still Water (330ml)', category: 'beverage', stockCount: 12, parLevel: 40, expiryDate: '2025-10-12' },
    { id: '2', name: 'Dark Truffles', category: 'snack', stockCount: 45, parLevel: 30, expiryDate: '2025-03-20' },
    { id: '3', name: 'Macadamia Mix', category: 'snack', stockCount: 8, parLevel: 25, expiryDate: '2025-04-01' },
    { id: '4', name: 'Linen Fragrance', category: 'other', stockCount: 15, parLevel: 10, expiryDate: '2026-06-10' },
  ]);

  const isLowStock = (item: InventoryItem) => item.stockCount < item.parLevel;
  const isNearExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 45;
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inventory Audit</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Live stock levels & expiry tracking</p>
        </div>
        <button className="bg-[#702052] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[#702052]/20 active:scale-95 transition-all">Audit Snapshot</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['beverage', 'snack', 'toiletry', 'other'].map(cat => (
          <div key={cat} className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm group hover:shadow-xl transition-all">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat} Asset</h4>
            <p className="text-4xl font-black mt-2 text-slate-900 group-hover:text-[#702052] transition-colors">{items.filter(i => i.category === cat).length}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
              <th className="px-10 py-8">Specification</th>
              <th className="px-10 py-8">Stock</th>
              <th className="px-10 py-8">Par</th>
              <th className="px-10 py-8">Expiry</th>
              <th className="px-10 py-8 text-right">Alerts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-10 py-8">
                  <div className="font-black text-slate-900 text-sm">{item.name}</div>
                  <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{item.category}</div>
                </td>
                <td className="px-10 py-8">
                  <span className={`font-black text-2xl ${isLowStock(item) ? 'text-red-700' : 'text-slate-900'}`}>
                    {item.stockCount}
                  </span>
                </td>
                <td className="px-10 py-8 text-slate-400 font-black text-[11px] tracking-wider">{item.parLevel}</td>
                <td className="px-10 py-8">
                  <div className={`text-xs font-black uppercase tracking-wider ${isNearExpiry(item.expiryDate) ? 'text-orange-600' : 'text-slate-500'}`}>
                    {new Date(item.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-10 py-8 text-right space-x-2">
                  {isLowStock(item) && (
                    <span className="bg-red-50 text-red-700 text-[9px] font-black px-4 py-2 rounded-xl border border-red-200 uppercase tracking-widest">Low Stock</span>
                  )}
                  {isNearExpiry(item.expiryDate) && (
                    <span className="bg-orange-50 text-orange-700 text-[9px] font-black px-4 py-2 rounded-xl border border-orange-200 uppercase tracking-widest">Expiry</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;