'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ShoppingBag, Heart, History, Sparkles, TrendingUp, Radio, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useWardrobeStore } from '@/lib/store/useWardrobeStore';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: LucideIcon, color: string }) => (
  <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl group hover:bg-white/10 transition-all duration-500">
    <div className="mb-4 flex items-center justify-between">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified</span>
    </div>
    <h3 className="text-sm font-bold text-white/60">{title}</h3>
    <p className="mt-1 text-2xl font-black text-white">{value}</p>
  </div>
);

export default function ConsumerDashboard() {
  const { data: session } = useSession();
  const wardrobeCount = useWardrobeStore((state) => state.getTotalItems());
  const totalPrice = useWardrobeStore((state) => state.getTotalPrice());

  return (
    <>
      <div className="mb-12 flex items-center justify-between pt-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic font-serif">IDENTITY CORE: {session?.user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Secure Consumer Experience Protocol v1.2</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-accent ring-1 ring-accent/50">
            <Radio size={12} className="animate-pulse" />
            Live Access
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Wardrobe Items" value={wardrobeCount.toString()} icon={ShoppingBag} color="bg-accent/20 text-accent" />
        <StatCard title="Total Investment" value={`$${totalPrice.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500/20 text-emerald-500" />
        <StatCard title="Wishlist Items" value="12" icon={Heart} color="bg-fuchsia-500/20 text-fuchsia-500" />
        <StatCard title="Exhibitions Visited" value="48" icon={Sparkles} color="bg-blue-500/20 text-blue-500" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Primary Interaction Zone */}
        <div className="lg:col-span-2 rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <Sparkles className="h-48 w-48 text-accent" />
          </div>
          <h2 className="text-xl font-black italic font-serif text-white mb-10 tracking-tight underline decoration-accent/20 underline-offset-8 uppercase">Navigation Protocol</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link href="/showrooms" className="group/card relative overflow-hidden rounded-[2.5rem] bg-accent p-8 text-background transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-accent/5">
              <Radio className="mb-4 h-6 w-6" />
              <p className="text-2xl font-black leading-tight uppercase">Enter<br />Showrooms</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                 Join Active Streams
              </div>
            </Link>
            
            <Link href="/consumer/wardrobe" className="group/card rounded-[2.5rem] bg-white/5 border border-white/10 p-8 text-white transition-all hover:bg-white/10 hover:border-white/20">
              <ShoppingBag className="mb-4 h-6 w-6 text-accent" />
              <p className="text-2xl font-black leading-tight uppercase">Access<br />Wardrobe</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                 Finalize Orders
              </div>
            </Link>
          </div>
        </div>

        {/* Activity Feed Sim */}
        <div className="rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-10 flex flex-col justify-between">
           <div>
            <h2 className="text-xl font-black italic font-serif text-white mb-10 flex items-center gap-3">
                <History size={24} className="text-accent" />
                TIMELINE
            </h2>
            <div className="space-y-8 relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 ml-[11px]" />
                
                {[
                  { title: "Private Concession Access", desc: "Vanguard Elite invited you to a private viewing.", time: "2h ago", icon: Sparkles },
                  { title: "Wardrobe Update", desc: "3 items added from 'Neo-Minimalist' collection.", time: "4h ago", icon: ShoppingBag },
                  { title: "System Ready", desc: "Your identity core is now fully established.", time: "Yesterday", icon: Radio },
                ].map((item, i) => (
                  <div key={i} className="relative pl-10">
                     <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-black border border-white/10 flex items-center justify-center z-10">
                        <item.icon size={10} className="text-accent" />
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{item.time}</span>
                     <h4 className="text-sm font-bold text-white mt-1 uppercase tracking-tight">{item.title}</h4>
                     <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
            </div>
           </div>
           
           <div className="mt-12 pt-8 border-t border-white/5">
              <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">
                 View Identity Records
              </button>
           </div>
        </div>
      </div>
    </>
  );
}
