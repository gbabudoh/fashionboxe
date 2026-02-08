'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Instagram, Twitter, Quote, Globe, SwatchBook, Sparkles, ChevronDown } from 'lucide-react';
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
const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Timepieces', 'Footwear', 'Beauty'];

export default function DesignersPage() {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const filteredDesigners = DESIGNERS.filter(designer => {
    const matchesCountry = selectedCountry === 'All' || designer.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All' || designer.category === selectedCategory;
    return matchesCountry && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />
      
      {/* Immersive Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-40 pb-32 px-6 max-w-7xl mx-auto">
        {/* Header HUD */}
        <div className="mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent/60">Creative Visionaries</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
            THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white italic font-serif">DESIGNERS</span>
          </h1>
          
          <p className="max-w-xl text-lg text-white/40 font-medium">
            Meet the architects of the avant-garde. The pioneers pushing the boundaries of cinematic fashion and digital artisanal luxury.
          </p>
        </div>

        {/* Filter HUD Overlay */}
        <div className="relative z-30 flex flex-col md:flex-row gap-6 mb-20">
          
          {/* Region Dropdown */}
          <div className="relative flex-1">
            <button 
              onClick={() => {
                setIsCountryOpen(!isCountryOpen);
                setIsCategoryOpen(false);
              }}
              className="w-full flex items-center justify-between gap-6 p-6 bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] border border-white/5 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-accent/40 transition-colors">
                  <Globe className="h-4 w-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">Filter by Region</p>
                  <p className="text-sm font-bold text-white">{selectedCountry}</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-white/20 transition-transform duration-500 ${isCountryOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCountryOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-4 p-3 bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl z-50 grid grid-cols-2 gap-2"
                >
                  {COUNTRIES.map((country) => (
                    <button
                      key={country}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsCountryOpen(false);
                      }}
                      className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                        selectedCountry === country 
                          ? 'bg-accent text-black' 
                          : 'hover:bg-white/5 text-white/40 hover:text-white'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category Dropdown */}
          <div className="relative flex-1">
            <button 
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsCountryOpen(false);
              }}
              className="w-full flex items-center justify-between gap-6 p-6 bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] border border-white/5 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-accent/40 transition-colors">
                  <SwatchBook className="h-4 w-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">Select Category</p>
                  <p className="text-sm font-bold text-white">{selectedCategory}</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-white/20 transition-transform duration-500 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-4 p-3 bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl z-50 grid grid-cols-2 gap-2"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                        selectedCategory === cat 
                          ? 'bg-accent text-black' 
                          : 'hover:bg-white/5 text-white/40 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredDesigners.map((designer, idx) => (
            <motion.div
              key={designer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-white/5 bg-secondary cursor-pointer ring-1 ring-white/10 transition-all duration-500 group-hover:ring-accent/40 group-hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <Image 
                  src={designer.image}
                  alt={designer.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                />
                
                {/* HUD Overlay - Glassmorphic Bio */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10 flex flex-col justify-end">
                   <div className="mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">{designer.role}</p>
                      <h3 className="text-4xl font-black tracking-tighter mb-1">{designer.name.split(' ')[0]} <br /> {designer.name.split(' ')[1]}</h3>
                      <p className="text-sm font-serif italic text-white/60">{designer.brand}</p>
                   </div>
                   
                   <div className="h-px w-full bg-white/10 mb-6 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                   
                   <div className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                      <p className="text-xs leading-relaxed text-white/60 font-medium mb-6">
                         {designer.bio}
                      </p>
                      
                      <div className="flex items-center justify-between">
                         <div className="flex gap-4">
                            <Instagram size={18} className="text-white/20 hover:text-accent transition-colors" />
                            <Twitter size={18} className="text-white/20 hover:text-accent transition-colors" />
                         </div>
                         <Link href={`/brand/${designer.brand.toLowerCase().replace(' ', '-')}`}>
                            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all">
                               <ArrowRight size={18} />
                            </div>
                         </Link>
                      </div>
                   </div>
                </div>

                {/* Signature Style HUD */}
                <div className="absolute top-10 right-10 rotate-90 origin-right translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent/60 whitespace-nowrap">Signature Style: {designer.signatureStyle}</span>
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
