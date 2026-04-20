'use client';

import React from 'react';
import { History, ShoppingBag, ArrowRight } from 'lucide-react';

const ORDERS = [
  { id: '#FBX-1092', brand: 'VANGUARD ELITE', date: '2026.04.18', status: 'SHIPPED', amount: '$4,200', items: 2 },
  { id: '#FBX-1085', brand: 'LUX NOIR', date: '2026.04.12', status: 'DELIVERED', amount: '$1,850', items: 1 },
  { id: '#FBX-1077', brand: 'AETHERIS GOLD', date: '2026.03.30', status: 'DELIVERED', amount: '$15,400', items: 1 },
];

export default function ConsumerOrdersPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter italic font-serif uppercase">Identity History</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Secure records of your acquisition protocol
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {ORDERS.map((order) => (
          <div key={order.id} className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/[0.04] transition-all">
             <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-accent">
                   <ShoppingBag size={24} />
                </div>
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1 block">{order.date}</span>
                   <h3 className="text-xl font-black tracking-tight text-white mb-1 uppercase">{order.brand}</h3>
                   <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">{order.id}</span>
                </div>
             </div>

             <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-start">
                <div className="text-center md:text-right">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Status</p>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'SHIPPED' ? 'text-emerald-500' : 'text-blue-500'}`}>{order.status}</span>
                </div>
                <div className="text-center md:text-right">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Items</p>
                   <span className="text-sm font-bold text-white">{order.items}</span>
                </div>
                <div className="text-center md:text-right min-w-[80px]">
                   <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Value</p>
                   <span className="text-lg font-black text-white">{order.amount}</span>
                </div>
                <button className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-black transition-all">
                   <ArrowRight size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="p-12 rounded-[3.5rem] bg-gradient-to-r from-accent/5 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
           <h4 className="text-2xl font-black italic font-serif text-white mb-2 underline decoration-accent/20 underline-offset-4 uppercase">Identity Support</h4>
           <p className="text-xs text-white/40 font-medium">Need priority assistance with an acquisition? Our luxury logistics team is standing by.</p>
        </div>
        <button className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">Contact Liaison</button>
      </div>
    </div>
  );
}
