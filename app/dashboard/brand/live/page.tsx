'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Radio, Users, MessageSquare, Activity, ShieldCheck, Zap, Power, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIMULATED_CHATS = [
  { user: "VogueInsider", msg: "The silhouette on that last piece was incredible.", time: "LIVE" },
  { user: "MilanCollector", msg: "Is the velvet ethically sourced?", time: "LIVE" },
  { user: "StyleBot_01", msg: "SENTIMENT POSITIVE: 98.4%", time: "SYS" },
  { user: "Alex_FBX", msg: "Can we see the details on the accessories?", time: "LIVE" },
];

export default function LiveStreamCommand() {
  const [isLive, setIsLive] = useState(false);
  const [audience, setAudience] = useState(0);
  const [chats, setChats] = useState(SIMULATED_CHATS);

  // Simulated Audience Growth Protocol
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setAudience(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Simulated Chat Feed
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newChat = { 
        user: `User_${Math.floor(Math.random() * 1000)}`, 
        msg: "AMAZING COLLECTION! 🔥", 
        time: "LIVE" 
      };
      setChats(prev => [newChat, ...prev.slice(0, 5)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLive = () => {
    const newState = !isLive;
    setIsLive(newState);
    if (!newState) {
      setAudience(0);
      setChats(SIMULATED_CHATS);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic font-serif flex items-center gap-4">
            <Radio size={28} className={isLive ? "text-red-500 animate-pulse" : "text-white/20"} />
            Broadcast Command
          </h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Concession Surveillance & Engagement Protocol</p>
        </div>
        
        <button 
          onClick={toggleLive}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 ${
            isLive 
              ? "bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white" 
              : "bg-emerald-500 text-black hover:scale-105 active:scale-95"
          }`}
        >
          <Power size={14} />
          {isLive ? "TERMINATE BROADCAST" : "INITIALIZE LIVE FEED"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-[3rem] bg-black border border-white/5 overflow-hidden group shadow-2xl">
              {/* Cinematic Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              
              {/* Simulated Feed Content */}
              {!isLive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                   <div className="h-20 w-20 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                      <Radio size={32} className="text-white/20" />
                   </div>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Standby for Transmission</p>
                </div>
              ) : (
                <>
                  <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      LIVE
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white/60 border border-white/10">
                      POV: MAIN RUNWAY
                    </div>
                  </div>
                  
                  <div className="absolute bottom-10 right-10 z-20">
                     <button className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <Maximize2 size={16} />
                     </button>
                  </div>

                  {/* Simulated Moving Image Background (Using placeholder with high-end feel) */}
                  <div className="absolute inset-0 grayscale opacity-40 bg-[url('https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center animate-walk-slow" />
                </>
              )}

              {/* Data Overlays (Always visible like a HUD) */}
              <div className="absolute inset-0 p-10 z-20 pointer-events-none opacity-60">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-accent uppercase tracking-widest">Signal Strength</p>
                      <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(i => <div key={i} className={`h-3 w-1 ${i <= 4 ? 'bg-accent' : 'bg-white/10'}`} />)}
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Encyption</p>
                       <ShieldCheck size={14} className="text-emerald-500 inline-block" />
                    </div>
                 </div>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Audience</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-white">{audience.toLocaleString()}</p>
                   <Users size={16} className="text-accent mb-1" />
                </div>
             </div>
             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Engagement</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-white">{isLive ? "84%" : "0%"}</p>
                   <Activity size={16} className="text-emerald-500 mb-1" />
                </div>
             </div>
             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Dropped Pkts</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-white">0.02</p>
                   <Zap size={16} className="text-fuchsia-500 mb-1" />
                </div>
             </div>
          </div>
        </div>

        {/* Engagement Protocol (Chat) */}
        <div className="rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-8 flex flex-col h-[600px]">
           <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-black italic font-serif text-white uppercase tracking-tight flex items-center gap-3">
                 <MessageSquare size={20} className="text-accent" />
                 SENSORY FEED
              </h2>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
           </div>

           <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
              <AnimatePresence>
                {chats.map((chat, i) => (
                  <motion.div 
                    key={i + chat.user}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black text-accent uppercase tracking-widest">{chat.user}</span>
                       <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${chat.time === 'SYS' ? 'bg-fuchsia-500/20 text-fuchsia-500' : 'bg-white/10 text-white/40'}`}>{chat.time}</span>
                    </div>
                    <p className="text-xs text-white/60 font-medium leading-relaxed">{chat.msg}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>

           <div className="mt-8 pt-6 border-t border-white/5">
              <div className="relative">
                 <input 
                  disabled={!isLive}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 disabled:opacity-50"
                  placeholder={isLive ? "Transmit Official Response..." : "Broadcasting Inactive"}
                 />
                 <button disabled={!isLive} className="absolute right-2 top-1/2 -translate-y-1/2 text-accent p-1 disabled:opacity-20">
                    <Zap size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
