'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Radio, Users, ArrowRight, Grid, List, Sparkles, SortAsc, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import CountrySelector from '@/components/CountrySelector';

interface Brand {
  id: string;
  name: string;
  slug: string;
  country: string;
  status: string;
  isLive: boolean;
  category: string;
  image: string;
}

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Jewellery', 'Beauty', 'Accessories'];

export default function ShowroomsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [sortBy, setSortBy] = useState<'latest' | 'alphabetical' | 'status' | 'recommended'>('recommended');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [hasFetched, setHasFetched] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  // 2026 UX: Debounced Search to prevent API spam while typing
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchBrands() {
      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category !== 'All') params.set('category', category);
        if (selectedCountry !== 'Global') params.set('country', selectedCountry);

        const res = await fetch(`/api/brands?${params.toString()}`);
        if (!res.ok) throw new Error('API unstable');
        const data = await res.json();
        
        // 2026 UX: Use real data first, fallback to mock only if DB is empty and no filters
        const isFiltered = debouncedSearch || category !== 'All' || selectedCountry !== 'Global';
        
        const mockFallback = [
          {
            id: '1',
            name: 'Vanguard Elite',
            slug: 'vanguard-elite',
            country: 'France',
            status: 'LIVE_STREAMING',
            isLive: true,
            category: 'Apparel',
            image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800"
          },
          {
            id: '2',
            name: 'Aetheris Gold',
            slug: 'aetheris-gold',
            country: 'Italy',
            status: 'OPEN',
            isLive: false,
            category: 'Jewellery',
            image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800"
          },
          {
            id: '3',
            name: 'Midnight Bloom',
            slug: 'midnight-bloom',
            country: 'United Kingdom',
            status: 'OPEN',
            isLive: false,
            category: 'Footwear',
            image: "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=800"
          },
          {
            id: '4',
            name: 'Elysian Aura',
            slug: 'elysian-aura',
            country: 'France',
            status: 'OPEN',
            isLive: false,
            category: 'Beauty',
            image: "https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=800"
          },
          {
            id: '5',
            name: 'Lumina Craft',
            slug: 'lumina-craft',
            country: 'Italy',
            status: 'OPEN',
            isLive: false,
            category: 'Accessories',
            image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800"
          }
        ];

        // If searching but nothing found, don't show mock fallback
        if (data && data.length > 0) {
          setBrands(data);
        } else if (!isFiltered) {
          setBrands(mockFallback);
        } else {
          setBrands([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setBrands([]);
      } finally {
        setHasFetched(true);
        setIsSearching(false);
      }
    }
    fetchBrands();
  }, [debouncedSearch, category, selectedCountry]);

  // Client-side filtering is now largely handled by the server, 
  // but we still apply sorting and local category logic if mocked
  const filteredBrands = [...brands]
    .sort((a, b) => {
      if (sortBy === 'recommended') {
        const getRecPriority = (s: string) => s === 'LIVE_STREAMING' ? 0 : s === 'OPEN' ? 1 : 2;
        // Prioritize Live then alphabetically
        if (getRecPriority(a.status) !== getRecPriority(b.status)) {
          return getRecPriority(a.status) - getRecPriority(b.status);
        }
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        const getPriority = (s: string) => s === 'LIVE_STREAMING' ? 0 : s === 'OPEN' ? 1 : 2;
        return getPriority(a.status) - getPriority(b.status);
      }
      // Latest is default (assumes data is already largely sorted by activity or ID)
      return 0;
    });

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <Header />

      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Background Atmosphere */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Page Title HUD */}
        <div className="relative z-10 mb-16 space-y-4">
          <div className="flex items-center gap-3 text-action uppercase tracking-[0.4em] text-[10px] font-black">
             <div className="h-1.5 w-1.5 rounded-full bg-action animate-ping" />
             Concession Directory Live
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-white font-serif italic">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-fuchsia to-accent">Showrooms</span>
          </h1>
          <p className="max-w-xl text-lg text-white/40 font-medium">
            Explore the world&apos;s most exclusive fashion concessions. Real-time access to high-fashion showrooms.
          </p>
        </div>

        {/* Filter HUD Overlay */}
        <div className="relative z-20 flex flex-col md:flex-row items-center gap-6 mb-12 p-3 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-none rounded-[40px]" />
          
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
              className={`absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center transition-colors z-20 cursor-pointer ${isSearchOpen ? 'text-action' : 'text-white/20 hover:text-white'}`}
            >
              <Search size={20} />
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
                    placeholder="Search showrooms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full bg-transparent border-none py-4 text-sm text-white placeholder:text-white/10 focus:outline-none ${isSearching ? 'animate-pulse' : ''}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isSearchOpen && search && (
              <button 
                onClick={() => {
                  setSearch('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-all cursor-pointer z-20"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-1 px-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`relative flex-shrink-0 px-4 py-2.5 rounded-[12px] text-[7px] font-black uppercase tracking-[0.35em] transition-all duration-500 cursor-pointer overflow-hidden group/btn ${
                  category === cat 
                    ? 'text-action' 
                    : 'text-white/30 hover:text-white'
                }`}
              >
                <div className={`absolute inset-0 transition-opacity duration-500 ${category === cat ? 'opacity-100' : 'opacity-0'}`}>
                   <div className="absolute inset-0 bg-action/10 backdrop-blur-md" />
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-action to-transparent shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
                </div>
                
                <span className="relative z-10 transition-transform duration-500 group-hover/btn:scale-110 block">
                   {cat}
                </span>
                
                {category !== cat && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            ))}
          </div>

          <div className="h-full w-px bg-white/10 hidden lg:block" />

          <div className="flex items-center gap-3">
              <CountrySelector 
                value={selectedCountry}
                onChange={setSelectedCountry}
                variant="dropdown"
                className="min-w-[140px]"
              />
          </div>

          <div className="h-full w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView('grid')}
              className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${view === 'grid' ? 'bg-white/10 text-action' : 'text-white/20'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${view === 'list' ? 'bg-white/10 text-action' : 'text-white/20'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Grid Animation HUD */}
        <div className={`relative z-10 grid gap-8 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence mode="popLayout">
            {filteredBrands.map((brand, idx) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05, type: 'spring', damping: 20, stiffness: 300 }}
              >
                <Link href={`/brand/${brand.slug}`} className="group relative block aspect-[4/3] rounded-[40px] overflow-hidden border border-white/5 bg-secondary shadow-2xl cursor-pointer">
                  <Image 
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {/* Status Badges HUD */}
                  <div className="absolute top-8 left-8 flex gap-3">
                    {brand.isLive ? (
                      <div className="flex items-center gap-2 rounded-full bg-action px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-background animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                        <Radio size={12} />
                        Live Showroom
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/60">
                         Showroom Open
                      </div>
                    )}
                    {(sortBy === 'recommended' && idx < 2) && (
                      <div className="flex items-center gap-2 rounded-full bg-accent/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-background shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        <Sparkles size={12} />
                        Top Pick
                      </div>
                    )}
                  </div>

                  {/* Brand Info HUD Overlay */}
                  <div className="absolute bottom-10 left-10 right-10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">{brand.category} · {brand.country}</p>
                    <h3 className="text-4xl font-black tracking-tighter font-serif italic mb-4">{brand.name}</h3>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                          <Users size={12} />
                          {brand.isLive ? '1.2K Watching' : 'Private Viewing'}
                       </div>
                       <div className="h-12 w-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <ArrowRight className="h-5 w-5 text-white" />
                       </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {hasFetched && filteredBrands.length === 0 && (
            <div className="col-span-full py-40 text-center animate-pulse">
               <Sparkles className="h-12 w-12 text-white/10 mx-auto mb-6" />
               <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">No Showrooms Match Your Request</p>
            </div>
          )}

          {!hasFetched && (
             <div className="col-span-full py-40 text-center">
                <div className="h-10 w-10 border-4 border-action border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-action font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Showrooms...</p>
             </div>
          )}
        </div>
      </div>
      
      {/* Footer Vignette */}
      <footer className="relative z-10 py-20 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Authorized High-Fashion Concessions · 2026</p>
        </div>
      </footer>
    </main>
  );
}
