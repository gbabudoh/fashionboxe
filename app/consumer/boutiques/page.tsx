'use client';

import React from 'react';
import { Sparkles, ArrowRight, Radio } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BOUTIQUES = [
  { id: 1, name: 'VANGUARD ELITE', region: 'MILAN, IT', status: 'LIVE NOW', image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 2, name: 'LUX NOIR', region: 'PARIS, FR', status: 'ACTIVE', image: 'https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 3, name: 'AETHERIS GOLD', region: 'ZURICH, CH', status: 'OFFLINE', image: 'https://images.pexels.com/photos/157675/fashion-men-s-fashion-suit-steampun-157675.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function ConsumerBoutiquesPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter italic font-serif uppercase">Established Boutiques</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Showrooms where your identity is recognized
          </p>
        </div>
        <Link href="/showrooms">
          <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
             Global Discovery
             <ArrowRight size={14} />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BOUTIQUES.map((boutique) => (
          <div key={boutique.id} className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/5 bg-white/[0.02]">
             <Image 
                src={boutique.image} 
                alt={boutique.name} 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-40 group-hover:opacity-100" 
             />
             
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-1">{boutique.region}</p>
                      <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic font-serif">{boutique.name}</h3>
                   </div>
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${boutique.status === 'LIVE NOW' ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/50' : 'bg-white/10 text-white/40'}`}>
                      {boutique.status === 'LIVE NOW' && <Radio size={12} className="animate-pulse" />}
                      {boutique.status}
                   </div>
                </div>
                
                <Link href="/showrooms" className="mt-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <button className="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors">
                      Enter Concession Environment
                   </button>
                </Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
