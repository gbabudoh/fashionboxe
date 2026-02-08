'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Radio, Users, Play, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

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

export default function LivePage() {
  const [liveBrands, setLiveBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveBrands = async () => {
      try {
        const response = await fetch('/api/brands'); // Assuming there's a brands API
        const data: Brand[] = await response.json();
        const live = data.filter((b) => b.status === 'LIVE_STREAMING' || b.isLive);
        setLiveBrands(live);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        // Fallback mock data if API fails
        setLiveBrands([
          {
            id: '1',
            name: 'Vanguard Elite',
            slug: 'vanguard-elite',
            country: 'Milan',
            status: 'LIVE_STREAMING',
            isLive: true,
            category: 'Apparel',
            image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'
          },
          {
            id: '2',
            name: 'Midnight Bloom',
            slug: 'midnight-bloom',
            country: 'London',
            status: 'LIVE_STREAMING',
            isLive: true,
            category: 'Accessories',
            image: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=800'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveBrands();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-foreground overflow-x-hidden">
      <Header />
      
      {/* Cinematic HUD Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-accent/5 to-transparent" />
      </div>

      <section className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Title */}
          <div className="mb-12 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 border border-red-500/20 mb-6"
            >
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Live Global Feed</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
              ACTIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-fuchsia to-accent">CONCESSIONS</span>
            </h1>
            <p className="max-w-2xl text-white/40 font-medium text-lg">
              Real-time immersive access to the world&apos;s most exclusive showrooms. 
              Join a live session to experience the runway directly.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video rounded-[2rem] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : liveBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveBrands.map((brand, idx) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/brand/${brand.slug}`}>
                    <div className="group relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-white/5 bg-secondary shadow-2xl cursor-pointer">
                      <Image 
                        src={brand.image}
                        alt={brand.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                      />
                      
                      {/* Live Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                      
                      <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                         <div className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/40">
                            <Radio className="h-2.5 w-2.5 animate-pulse" />
                            Live
                         </div>
                         <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white/90 ring-1 ring-white/10">
                            <Users className="h-2.5 w-2.5" />
                            {Math.floor(Math.random() * 5000) + 100} Watching
                         </div>
                      </div>

                      <div className="absolute bottom-6 left-8 right-8 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">{brand.country}</p>
                        <h3 className="text-2xl font-black tracking-tight mb-4">{brand.name}</h3>
                        
                        <div className="flex items-center justify-between">
                          <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black transition-all group-hover:bg-accent group-hover:scale-105">
                            <Play className="h-3 w-3 fill-current" />
                            Join Stream
                          </button>
                          <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                 <Sparkles className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No active sessions at the moment</h3>
              <p className="text-white/40 mb-8">All concessions are currently in preparation for the next runway.</p>
              <Link href="/showrooms">
                <button className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-3 text-sm font-black text-white hover:bg-white/20 transition-all mx-auto">
                  Browse Showrooms
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
