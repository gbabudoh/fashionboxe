'use client';

import React from 'react';
import { Heart, ShoppingBag, Sparkles, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Simulated Wishlist Data
const WISHLIST_ITEMS = [
  { id: 'w1', name: 'SILK MIDI SKIRT', brand: 'VALENTINO', price: '$2,450', image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'w2', name: 'STRUCTURAL BLAZER', brand: 'VANGUARD ELITE', price: '$3,800', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'w3', name: 'GOLDEN CHRONOS', brand: 'AETHERIS GOLD', price: '$12,400', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function ConsumerWishlistPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter italic font-serif uppercase">My Wishlist</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            {WISHLIST_ITEMS.length} Curated artifacts reserved for selection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {WISHLIST_ITEMS.map((item) => (
          <div key={item.id} className="group relative rounded-[2.5rem] border border-white/5 bg-white/[0.02] overflow-hidden hover:border-accent/30 transition-all duration-700">
             <div className="aspect-[3/4] relative">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" 
                />
                
                <div className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-accent group-hover:bg-accent group-hover:text-black transition-all">
                   <Heart size={16} fill="currentColor" />
                </div>
             </div>
             
             <div className="p-8">
                <p className="text-[9px] font-black text-accent/60 uppercase tracking-widest mb-1">{item.brand}</p>
                <h3 className="text-xl font-black tracking-tight text-white mb-6 uppercase">{item.name}</h3>
                
                <div className="flex items-center justify-between">
                   <span className="text-sm font-black text-white">{item.price}</span>
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      <Plus size={12} />
                      Transfer to Wardrobe
                   </button>
                </div>
             </div>
          </div>
        ))}

        {/* Empty Slot Simulator */}
        <div className="rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center space-y-6 py-20 bg-white/[0.01]">
            <Sparkles className="h-10 w-10 text-white/5" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Expand your collection</p>
            <Link href="/showrooms" className="px-6 py-3 bg-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Discover Showrooms</Link>
        </div>
      </div>
    </div>
  );
}
