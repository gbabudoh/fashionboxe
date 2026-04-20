'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Instagram, Twitter, Quote, Sparkles } from 'lucide-react';
import Header from '@/components/Header';

interface Designer {
  id: string;
  name: string;
  role: string;
  brand: string;
  country: string;
  category: string;
  bio: string;
  signatureStyle: string;
  image: string;
  instagram?: string;
  twitter?: string;
}

const DESIGNERS: Designer[] = [
  {
    id: '1',
    name: 'Alessandro Valente',
    role: 'Creative Director',
    brand: 'Vanguard Elite',
    country: 'France',
    category: 'Apparel',
    bio: 'Pioneer of the "Neo-Minimalist" movement, Alessandro blends industrial textures with high-fashion silhouettes to create garments that feel like wearable architecture.',
    signatureStyle: 'Structural tailoring, industrial-grade textiles, monotone palettes.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    instagram: '@alessandro_valente',
  },
  {
    id: '2',
    name: 'Elena Morretti',
    role: 'Lead Designer',
    brand: 'Midnight Bloom',
    country: 'United Kingdom',
    category: 'Accessories',
    bio: 'Elena explores the intersection of bioluminescent patterns and sustainable silk. Her collections are known for their ethereal glow and organic, fluid forms.',
    signatureStyle: 'Bioluminescent embroidery, fluid silk draping, sustainable organics.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
    instagram: '@elena_bloom',
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    role: 'Founder & Visionary',
    brand: 'Aetheris Gold',
    country: 'Italy',
    category: 'Timepieces',
    bio: 'A former horological engineer, Marcus treats every garment as a precision instrument, integrating micro-mechanics into artisanal luxury wear.',
    signatureStyle: 'Mechanical accents, 24k gold threading, precision engineering.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
    instagram: '@marcusthorne_gold',
  }
];

const COUNTRIES = ['All', 'France', 'Italy', 'United Kingdom', 'USA', 'Japan'];

export default function DesignersPage() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'alphabetical'>('recommended');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // 2026 UX: Debounced Search for fluid performance
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const mounted = React.useRef(false);
  
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredDesigners = DESIGNERS.filter(designer => {
    const matchesSearch = !debouncedSearch || 
      designer.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      designer.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || designer.country === selectedCountry;
    return matchesSearch && matchesCountry;
  }).sort((a, b) => {
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    // Recommended logic: Simulation for demo
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <Header />
      
      {/* Cinematic Layer 0: Film Grain & Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full" />
      </div>

      {/* Cinematic Layer 1: Scanlines */}
      <div className="fixed inset-0 z-1 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <section className="relative pt-40 pb-32 px-6 max-w-7xl mx-auto z-10">
        {/* Header HUD */}
        <div className="mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent/60 animate-pulse">Creator Database 2026.04</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
            THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white italic font-serif">DESIGNERS</span>
          </h1>
          
          <p className="max-w-xl text-lg text-white/40 font-medium">
            Meet the architects of the avant-garde. The pioneers pushing the boundaries of cinematic fashion and digital artisanal luxury.
          </p>
        </div>

        {/* Unified Discovery HUD Integration */}
        <div className="relative z-30 flex flex-col md:flex-row items-center gap-6 mb-20 p-6 bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
          
          {/* Expanding Search HUD */}
          <motion.div 
            initial={false}
            animate={{ width: isSearchOpen ? '280px' : '64px' }}
            className="relative flex items-center h-16 bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-inner group"
          >
            <button 
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className={`absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center transition-colors z-20 cursor-pointer ${isSearchOpen ? 'text-accent' : 'text-white/20 hover:text-white'}`}
            >
              <ArrowRight className={`h-5 w-5 transition-transform duration-500 ${isSearchOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 pl-16 pr-10"
                >
                  <input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search creators..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setIsSearching(true);
                    }}
                    className={`w-full bg-transparent border-none py-4 text-sm text-white placeholder:text-white/10 focus:outline-none ${isSearching ? 'animate-pulse' : ''}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide flex-1">
             {COUNTRIES.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    selectedCountry === country 
                      ? 'bg-accent text-black shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {country}
                </button>
             ))}
          </div>

          <div className="h-10 w-px bg-white/10 hidden lg:block" />

          {/* Sorting Toggles */}
          <div className="flex items-center gap-4 bg-black/20 rounded-2xl p-1 border border-white/5">
             {(['recommended', 'alphabetical'] as const).map((id) => (
               <button
                 key={id}
                 onClick={() => setSortBy(id)}
                 className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                   sortBy === id 
                     ? 'bg-white/10 text-white shadow-lg' 
                     : 'text-white/20 hover:text-white/40'
                 }`}
               >
                 {id === 'recommended' ? 'Best' : 'A-Z'}
               </button>
             ))}
          </div>
        </div>

        {/* Interactive Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredDesigners.map((designer, idx) => (
            <motion.div
              key={designer.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1, type: 'spring', damping: 20, stiffness: 300 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-white/5 bg-secondary cursor-pointer ring-1 ring-white/10 transition-all duration-700 group-hover:ring-accent/40 group-hover:shadow-[0_0_80px_rgba(212,175,55,0.15)]">
                <Image 
                  src={designer.image}
                  alt={designer.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[40%] group-hover:grayscale-0"
                />
                
                {/* HUD Overlay - Glassmorphic Bio */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:via-black/40 transition-all duration-700" />
                
                {/* Top Pick Badge */}
                {idx === 0 && sortBy === 'recommended' && (
                  <div className="absolute top-8 left-8 flex items-center gap-2 rounded-full bg-accent/90 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-background shadow-[0_10px_30px_rgba(212,175,55,0.3)] animate-pulse">
                    <Sparkles size={12} />
                    Top Pick
                  </div>
                )}

                <div className="absolute bottom-10 left-10 right-10 flex flex-col justify-end">
                   <div className="mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1 drop-shadow-lg">{designer.role}</p>
                      <h3 className="text-4xl font-black tracking-tighter mb-1 text-white">{designer.name.split(' ')[0]} <br /> {designer.name.split(' ')[1]}</h3>
                      <p className="text-sm font-serif italic text-white/50 tracking-wide">{designer.brand}</p>
                   </div>
                   
                   <div className="h-[1px] w-full bg-white/10 mb-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                   
                   <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                      <p className="text-[11px] leading-relaxed text-white/50 font-medium mb-6">
                         {designer.bio}
                      </p>
                      
                      <div className="flex items-center justify-between">
                         <div className="flex gap-5">
                            <Instagram size={16} className="text-white/20 hover:text-accent transition-colors" />
                            <Twitter size={16} className="text-white/20 hover:text-accent transition-colors" />
                         </div>
                         <Link href={`/brand/${designer.brand.toLowerCase().replace(' ', '-')}`}>
                            <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all group/btn">
                               <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                         </Link>
                      </div>
                   </div>
                </div>

                {/* Signature Style HUD */}
                <div className="absolute top-10 right-10 rotate-90 origin-right translate-x-full opacity-0 group-hover:translate-x-4 group-hover:opacity-100 transition-all duration-700">
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-accent/40 whitespace-nowrap">SIGNATURE: {designer.signatureStyle}</span>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {filteredDesigners.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center"
          >
             <Sparkles className="h-12 w-12 text-white/10 mx-auto mb-6" />
             <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">No Designers Match Selected Filters</p>
          </motion.div>
        )}

        {/* Quote Section HUD */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.02)_0%,_transparent_100%)]" />
          <Quote className="h-12 w-12 text-accent/20 mx-auto mb-10" />
          <h2 className="text-4xl md:text-5xl font-serif italic text-white/80 leading-snug max-w-4xl mx-auto mb-10">
            &quot;Fashion is no longer just about the garment; it&apos;s about the immersive story told through the lens of the creator.&quot;
          </h2>
          <div className="flex flex-col items-center">
             <div className="h-px w-20 bg-accent/40 mb-4" />
             <span className="text-xs font-black uppercase tracking-[0.4em] text-white/40">The Fashionboxe Manifesto</span>
          </div>
        </motion.div>
      </section>

      {/* Footer Vignette */}
      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Creative Minds of 2026 · Global Concessions Group</p>
      </footer>
    </main>
  );
}
