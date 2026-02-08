'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Share2, 
  Maximize2, 
  ShieldCheck, 
  UserCircle, 
  ShoppingBag,
  Activity,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useWardrobeStore } from '@/lib/store/useWardrobeStore';
import { toast } from 'react-hot-toast';

interface RunwayLook {
  id: string;
  designer: string;
  name: string;
  price: string;
  image: string;
  description: string;
  tags: string[];
}

const LOOKS: RunwayLook[] = [
  {
    id: 'look-1',
    designer: 'ALESSANDRO VALENTE',
    name: 'Neural Armor Coat',
    price: '$4,200',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Structural neo-minimalism featuring industrial-grade smart textiles and reactive thermal lining.',
    tags: ['NEO-MINIMALISM', 'SMART-WEAR', 'SS26']
  },
  {
    id: 'look-2',
    designer: 'ELENA MORRETTI',
    name: 'Biolume Silk Gown',
    price: '$7,800',
    image: 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Sustainable silk infused with bioluminescent threading that reacts to the environment.',
    tags: ['BIOLUMINESCENT', 'SUSTAINABLE', 'COUTRE']
  },
  {
    id: 'look-3',
    designer: 'MARCUS THORNE',
    name: 'Aetheris Gold Suit',
    price: '$12,500',
    image: 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Precision engineered suit with 24k gold micro-threading and integrated kinetic actuators.',
    tags: ['PRECISION', 'GOLD-CORE', 'AVANT-GARDE']
  }
];

export default function RunwayPage() {
  const router = useRouter();
  const wardrobeCount = useWardrobeStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);
  const [isLanding, setIsLanding] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const [currentLookIdx, setCurrentLookIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const addItem = useWardrobeStore((state) => state.addItem);

  const handleAddToWardrobe = (look: RunwayLook) => {
    addItem({
      id: look.id,
      name: look.name,
      price: look.price,
      image: look.image,
      designer: look.designer,
      category: look.tags[0]
    });
    toast.success((t) => (
      <div className="flex items-center gap-3">
        <span>Added to Wardrobe</span>
        <button 
          onClick={() => {
            router.push('/wardrobe');
            toast.dismiss(t.id);
          }}
          className="bg-accent text-background px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter hover:scale-105 transition-transform cursor-pointer"
        >
          View
        </button>
      </div>
    ), {
      style: {
        background: '#000',
        color: '#d4af37',
        border: '1px solid rgba(212,175,55,0.2)',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      iconTheme: {
        primary: '#d4af37',
        secondary: '#000',
      },
    });
  };

  const [audioBars] = useState(() => 
    [0.3, 0.8, 0.5, 1, 0.4, 0.1, 0.9, 0.6, 0.2, 0.7].map(h => ({
      h,
      duration: 1 + Math.random()
    }))
  );

  useEffect(() => {
    if (isLanding) {
      const timer = setTimeout(() => setIsLanding(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLanding]);

  useEffect(() => {
    if (!isLanding) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentLookIdx((idx) => (idx + 1) % LOOKS.length);
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLanding]);

  const currentLook = LOOKS[currentLookIdx];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {isLanding ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            {/* Cinematic Authentication HUD */}
            <div className="relative flex flex-col items-center max-w-md w-full px-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-24 h-48 w-48 border border-accent/20 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-28 h-56 w-56 border border-white/5 rounded-full"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center text-center space-y-8"
              >
                 <div className="h-20 w-px bg-gradient-to-t from-accent to-transparent" />
                 
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-accent/60">System Online</span>
                    <h2 className="text-4xl font-black tracking-tighter italic font-serif">THE RUNWAY</h2>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                       <ShieldCheck className="h-5 w-5 text-accent mb-2" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Secure Access</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                       <Zap className="h-5 w-5 text-accent mb-2" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Neural Link</span>
                    </div>
                 </div>

                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      className="h-full bg-accent shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    />
                 </div>
                 
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/40 animate-pulse">
                    Authenticating Front Row Access...
                 </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="runway-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen relative flex overflow-hidden"
          >
            {/* Global Background HUD Elements */}
            <div className="fixed inset-0 pointer-events-none z-10">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/40 to-transparent" />
               <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />
               <div className="absolute inset-0 ring-[40px] ring-black/20" />
            </div>

            {/* Left Control Bar HUD */}
            <div className="relative z-[60] w-24 h-full border-r border-white/10 bg-black/40 backdrop-blur-3xl flex flex-col items-center py-10 justify-between">
               <Link href="/">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group cursor-pointer">
                     <ArrowLeft className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                  </div>
               </Link>

               <div className="flex flex-col gap-6">
                   <Link href="/wardrobe" className="relative group/cart cursor-pointer">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/cart:bg-accent group-hover/cart:text-black transition-all">
                        <ShoppingBag className="h-5 w-5" />
                        {mounted && wardrobeCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-background ring-2 ring-black">
                            {wardrobeCount}
                          </span>
                        )}
                      </div>
                   </Link>
                   <div className="h-px w-8 bg-white/10 mx-auto" />
                  {['01', '02', '03'].map((ch) => (
                    <button key={ch} className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all cursor-pointer ${
                      currentLookIdx === parseInt(ch, 10)-1 ? 'bg-accent border-accent text-black shadow-lg shadow-accent/20' : 'bg-white/5 border-white/10 text-white/20 hover:text-white'
                    }`}>
                      CH.{ch}
                    </button>
                  ))}
               </div>

               <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                  <Maximize2 className="h-5 w-5 text-white/40" />
               </div>
            </div>

            {/* Main Immersive Stage */}
            <div className="flex-1 relative h-full">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={currentLook.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={currentLook.image}
                      alt={currentLook.name}
                      fill
                      className="object-cover opacity-60"
                      priority
                    />
                    
                    {/* Parallax Depth Layer */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
                  </motion.div>
                </AnimatePresence>

                {/* Center Stage Info Overlays */}
                <div className="absolute top-12 left-10 z-[50]">
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-4 px-6 py-2 bg-accent/90 rounded-full text-black"
                   >
                      <Activity className="h-4 w-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">LIVE BROADCAST</span>
                      <div className="h-4 w-px bg-black/20" />
                      <span className="text-[10px] font-black tracking-widest">AETHER_STREAM_v04</span>
                   </motion.div>
                </div>

                <div className="absolute bottom-32 left-10 z-[50] max-w-xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentLook.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/80">{currentLook.designer}</span>
                            <div className="h-px w-12 bg-accent/40" />
                         </div>
                         <h1 className="text-8xl font-black tracking-tighter leading-none italic font-serif">
                            {currentLook.name.split(' ')[0]} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white">
                               {currentLook.name.split(' ').slice(1).join(' ')}
                            </span>
                         </h1>
                         <p className="text-white/40 text-lg font-medium leading-relaxed">
                            {currentLook.description}
                         </p>
                      </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress HUD Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 z-[70] bg-white/5">
                   <motion.div 
                     style={{ width: `${progress}%` }}
                     className="h-full bg-accent shadow-[0_0_20px_rgba(212,175,55,1)]"
                   />
                </div>
            </div>

            {/* Right Interactive Shop HUD */}
            <div className="relative z-[60] w-96 h-full flex flex-col p-8 border-l border-white/10 bg-black/60 backdrop-blur-3xl">
               <div className="flex items-center justify-between mb-12">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-0.5">Front Row ID</span>
                     <span className="text-sm font-bold opacity-80 uppercase tracking-tighter">SECURE_USER_A02</span>
                  </div>
                  <UserCircle className="h-8 w-8 text-white/20" />
               </div>

               <div className="flex items-center gap-4 mb-8">
                  <div className="flex flex-1 items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                     <Eye className="h-4 w-4 text-accent" />
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Viewers</span>
                        <span className="text-xs font-bold leading-none">1.2K</span>
                     </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                     <Heart className="h-4 w-4 text-pink-500" />
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Appreciation</span>
                        <span className="text-xs font-bold leading-none">842</span>
                     </div>
                  </div>
               </div>

               {/* Shop the Look Box */}
               <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xl font-black italic font-serif">SHOP THE LOOK</h3>
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Featured</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                     <AnimatePresence mode="popLayout">
                        <motion.div
                          key={currentLook.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group relative h-[450px] w-full rounded-[2.5rem] overflow-hidden border border-white/10"
                        >
                           <Image 
                              src={currentLook.image}
                              alt={currentLook.name}
                              fill
                              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                           
                           <div className="absolute bottom-6 left-6 right-6">
                              <div className="mb-4">
                                 <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">{currentLook.price}</p>
                                 <h4 className="text-2xl font-black tracking-tighter uppercase">{currentLook.name}</h4>
                              </div>
                              
                              <button 
                                onClick={() => handleAddToWardrobe(currentLook)}
                                className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-accent transition-colors cursor-pointer"
                              >
                                 <ShoppingBag className="h-4 w-4" />
                                 Add to Cart
                              </button>
                           </div>
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
                  <button className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
                     <Share2 className="h-5 w-5" />
                  </button>
                  <button className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 group hover:border-accent/40 transition-all cursor-pointer">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Digital Pre-Order</span>
                     <ChevronRight className="h-4 w-4 text-accent" />
                  </button>
               </div>
            </div>

            {/* Ambient Tech Audio Simulation HUD (Visual Only) */}
            <div className="fixed bottom-10 left-32 z-[80] flex items-end gap-1 px-4 py-2 bg-white/5 backdrop-blur-3xl rounded-xl border border-white/10 h-10">
               {audioBars.map((bar, i) => (
                 <motion.div 
                  key={i}
                  animate={{ height: ["4px", `${bar.h * 100}%`, "4px"] }}
                  transition={{ duration: bar.duration, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 bg-accent/40 rounded-full"
                 />
               ))}
               <span className="ml-3 text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">AUDIO_FEED_01</span>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
