'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Users, X, Box, Camera, Sparkles, Volume2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWardrobeStore } from '@/lib/store/useWardrobeStore';
import { useLiveStore } from '@/lib/store/useLiveStore';
import { toast } from 'react-hot-toast';
import JitsiMeeting from '@/components/JitsiMeeting';
import LiveChat from '@/components/LiveChat';

interface Product {
  id: string;
  name: string;
  price: number | string;
  image: string;
  category: string;
  hotspots?: { x: number; y: number };
}

interface LivePlayerProps {
  streamUrl: string;
  brandName: string;
  brandId: string;
  products: Product[];
  fallbackVideoUrl?: string;
}

export default function LivePlayer({ streamUrl, brandName, brandId, products, fallbackVideoUrl }: LivePlayerProps) {
  const router = useRouter();
  const [activeTryOn, setActiveTryOn] = useState<Product | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCheckout, setActiveCheckout] = useState<Product | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confetti, setConfetti] = useState<{id: number, x: number, rotate: number, duration: number, delay: number}[]>([]);
  
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
      setConfetti([...Array(20)].map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 1000,
        rotate: Math.random() * 360,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 0.5
      })));
    });
  }, []);
  
  const addItem = useWardrobeStore((state) => state.addItem);
  const wardrobeCount = useWardrobeStore((state) => state.getTotalItems());
  
  const { isShopperActive, jitsiRoomId, setShopperActive } = useLiveStore();

  const [activities] = useState([
    { id: 1, text: `GUEST IN MILAN JUST VIEWED ${brandName.toUpperCase()}` },
    { id: 2, text: "COLLECTION 2026 UNVEILING IN 15 MINS" },
    { id: 3, text: `30+ USERS EXPLORING ${brandName.toUpperCase()} NOW` },
    { id: 4, text: "VIP CONCIERGE SESSION JUST ENDED" }
  ]);

  const handleAddToWardrobe = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brandId: brandId,
      brand: brandName,
      category: product.category
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
        color: '#00f0ff',
        border: '1px solid rgba(0,240,255,0.2)',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      iconTheme: {
        primary: '#00f0ff',
        secondary: '#000',
      },
    });
  };

  const handleTryOn = async (product: Product) => {
    setActiveTryOn(product);
    try {
      await fetch('/api/interactions/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, brandId }),
      });
    } catch (error) {
      console.error('[LIVE_PLAYER] Failed to trigger try-on alert:', error);
    }
  };

  const executePayment = async (product: Product) => {
    // 2026 UX: Experience the celebration trigger before redirection
    setActiveCheckout(null);
    setCelebrating(true);
    
    // Simulate celebration duration
    setTimeout(() => {
       setCelebrating(false);
    }, 4000);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.url) {
        // Redirection happens after a short delay to let celebration play
        setTimeout(() => {
           window.location.href = data.url;
        }, 2000);
      }
    } catch (error) {
      console.error('[LIVE_PLAYER] Checkout error:', error);
      setCelebrating(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Layer 1: The Optimized Stream/Video Layer */}
      {streamUrl && !streamUrl.includes('demo.owncast.online') ? (
        <iframe
          src={`${streamUrl}/embed/video${isMuted ? '?muted=true' : ''}`}
          title={`${brandName} Live Stream`}
          className="absolute inset-0 w-full h-full border-0 object-cover"
          allowFullScreen
          allow="autoplay; encrypted-media"
          onError={() => console.log("Stream failed, showing backup...")}
        />
      ) : (
        /* 2026 UX: High-Fidelity Video Loop Fallback for Unstable Streams */
        <video
          src={fallbackVideoUrl || "https://player.vimeo.com/external/494441551.sd.mp4?s=49fc751a027962886f4553531b4632db2f2c8d28&profile_id=164&oauth2_token_id=57447761"}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Layer 1.5: Tap to Unmute Overlay */}
      <AnimatePresence>
        {isMuted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMuted(false)}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm group"
          >
            <div className="relative h-24 w-24 flex items-center justify-center rounded-full bg-white/10 border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
               <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" />
               <Volume2 className="h-8 w-8 text-white" />
            </div>
            <span className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">Tap to Experience Audio</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Layer 2: Status Overlays (HUD) */}
      <div className="absolute left-10 top-32 z-20 flex items-center gap-4">
        <span className="flex items-center gap-2 rounded-full bg-action px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-background shadow-2xl shadow-action/40 animate-pulse">
          <Radio className="h-3 w-3" />
          Live
        </span>
        <span className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-2xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border border-white/10">
          <Users className="h-3 w-3" />
          1.2K Watching
        </span>
      </div>

      {/* Phase 3: Real-time Activity Ticker */}
      <div className="absolute left-10 top-44 z-30 w-80 overflow-hidden mask-fade-right">
         <motion.div 
           animate={{ x: '-100%' }}
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
           className="flex gap-12 whitespace-nowrap"
         >
            {activities.map(a => (
              <span key={a.id} className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                {a.text}
              </span>
            ))}
            {activities.map(a => (
              <span key={`dup-${a.id}`} className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                {a.text}
              </span>
            ))}
         </motion.div>
      </div>

      {/* Spatial Product HUD (Hotspots) */}
      <div className="absolute inset-0 pointer-events-none z-20">
         {products.filter(p => p.hotspots).map((product) => (
           <motion.div
             key={`hotspot-${product.id}`}
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             style={{ 
               left: `${product.hotspots?.x}%`, 
               top: `${product.hotspots?.y}%` 
             }}
             className="absolute pointer-events-auto group"
           >
              {/* Glowing Pulse Marker */}
              <div className="relative flex items-center justify-center">
                 <div className="absolute h-8 w-8 rounded-full bg-action animate-ping opacity-20" />
                 <div className="h-4 w-4 rounded-full bg-action border-2 border-white shadow-[0_0_15px_rgba(0,240,255,0.6)] cursor-pointer group-hover:scale-125 transition-transform" />
                 
                 {/* Product Peek-a-boo HUD */}
                 <motion.div 
                   initial={{ opacity: 0, x: 20, pointerEvents: 'none' }}
                   whileHover={{ opacity: 1, x: 10, pointerEvents: 'auto' }}
                   className="absolute left-full ml-4 p-4 bg-black/80 backdrop-blur-3xl rounded-2xl border border-white/10 min-w-[200px] opacity-0 group-hover:opacity-100 group-hover:block transition-all shadow-2xl"
                 >
                    <div className="flex gap-4 items-center mb-3">
                       <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/10">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[8px] font-black text-action uppercase tracking-widest">{product.category}</p>
                          <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                       </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                       <span className="text-sm font-black text-white">${product.price}</span>
                       <button 
                         onClick={() => handleAddToWardrobe(product)}
                         className="px-3 py-1.5 bg-action text-background text-[8px] font-black uppercase tracking-tighter rounded-full hover:scale-105 active:scale-95 transition-all"
                       >
                          Add to Cart
                       </button>
                    </div>
                 </motion.div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Shopping Bag Icon HUD */}
      <div className="absolute right-10 top-32 z-20">
         <Link href="/wardrobe">
           <button 
             className="relative h-14 w-14 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 hover:bg-black/60 transition-all group cursor-pointer"
           >
             <ShoppingBag className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
             {mounted && wardrobeCount > 0 && (
               <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-action text-[10px] font-bold text-background flex items-center justify-center border-2 border-black">
                 {wardrobeCount}
               </span>
             )}
           </button>
         </Link>
      </div>

      {/* Layer 3: Interactive Product HUD */}
      <div className="absolute bottom-10 left-10 right-10 z-30 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex-shrink-0 flex items-center gap-5 p-4 bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/10 min-w-[340px] group transition-all hover:bg-black/60 hover:border-action/40 shadow-2xl"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[.2em] text-action font-black mb-1">{product.category}</p>
              <h3 className="text-base font-bold text-white truncate font-serif italic mb-2">{product.name}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTryOn(product)}
                  className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5 text-action" />
                  Try On
                </button>
                <button
                  onClick={() => handleAddToWardrobe(product)}
                  className="flex items-center gap-2 rounded-full bg-action px-4 py-2 text-[10px] font-black uppercase tracking-widest text-background transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to Cart
                </button>
                <span className="ml-auto text-sm font-bold text-white/80">${product.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Layer 4: AR Virtual Try-On HUD (PiP Mode) */}
      <AnimatePresence>
        {activeTryOn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-10 top-40 z-50 h-[calc(100vh-450px)] rounded-[40px] bg-black/60 backdrop-blur-3xl border border-white/20 flex flex-col items-center justify-center p-12 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            {/* Mirror/Camera Background Placeholder */}
            <div className="absolute inset-0 z-0 bg-linear-to-tr from-accent/5 to-action/5" />
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <button 
              onClick={() => setActiveTryOn(null)}
              className="absolute top-10 right-10 h-14 w-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative z-10 max-w-xl w-full text-center space-y-10">
              <div className="relative w-56 h-56 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 border-2 border-dashed border-action/40 rounded-full" 
                />
                <div className="relative h-full w-full rounded-full border-2 border-action/30 p-3 bg-black/40">
                   <div className="h-full w-full rounded-full overflow-hidden border border-white/10 ring-8 ring-action/10">
                     <Image
                       src={activeTryOn.image}
                       alt={activeTryOn.name}
                       fill
                       className="object-cover"
                     />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter font-serif italic">AR Mirror</h2>
                <div className="flex items-center justify-center gap-3 text-action uppercase tracking-[0.4em] text-[10px] font-black">
                   <div className="h-1.5 w-1.5 rounded-full bg-action animate-ping" />
                   Initializing Neural Overlay
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-4 group hover:bg-white/10 transition-all">
                  <Camera className="h-7 w-7 text-action group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Calibrate View</span>
                </div>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-4 group hover:bg-white/10 transition-all">
                  <Box className="h-7 w-7 text-action group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Fit Selection</span>
                </div>
              </div>

              <button className="w-full rounded-full bg-action py-5 text-xs font-black uppercase tracking-[0.3em] text-background hover:scale-[1.05] transition-all shadow-[0_20px_40px_rgba(0,240,255,0.3)] active:scale-95">
                Grant Camera Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 5: Instant Buy Sliding Drawer */}
      <AnimatePresence>
        {activeCheckout && (
          <div className="absolute inset-0 z-[100]">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setActiveCheckout(null)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute bottom-0 left-0 right-0 bg-[#121212] rounded-t-[48px] border-t border-white/10 p-10 pb-16 flex flex-col"
             >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
                
                <div className="flex items-center gap-8 mb-10">
                   <div className="h-32 w-32 rounded-3xl overflow-hidden border border-white/10 flex-shrink-0">
                      <Image src={activeCheckout.image} alt={activeCheckout.name} width={128} height={128} className="object-cover h-full w-full" />
                   </div>
                   <div className="flex-1">
                      <p className="text-xs font-black text-action uppercase tracking-[0.2em] mb-2">{activeCheckout.category}</p>
                      <h2 className="text-3xl font-black text-white font-serif italic mb-1">{activeCheckout.name}</h2>
                      <p className="text-2xl font-bold text-white/60">${activeCheckout.price}</p>
                   </div>
                   <button onClick={() => setActiveCheckout(null)} className="h-14 w-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                      <X className="h-6 w-6 text-white" />
                   </button>
                </div>

                <div className="space-y-4">
                   <button 
                     onClick={() => executePayment(activeCheckout)}
                     className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95"
                   >
                     <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/512px-Apple_Pay_logo.svg.png" alt="Apple Pay" width={40} height={40} className="invert" />
                     Pay with Apple Pay
                   </button>
                   <button 
                     onClick={() => executePayment(activeCheckout)}
                     className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-colors active:scale-95"
                   >
                     Instant Local Transfer
                   </button>
                </div>

                <p className="mt-8 text-center text-[10px] text-white/30 uppercase tracking-widest font-bold">
                   Secure Multi-tenant Checkout Powered by Fashionboxe Pay
                </p>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Layer 6: Celebration HUD (Post-Purchase) */}
      <AnimatePresence>
        {celebrating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center bg-action/20 backdrop-blur-md"
          >
             <motion.div 
               initial={{ scale: 0, rotate: -20 }}
               animate={{ scale: 1.2, rotate: 0 }}
               transition={{ type: 'spring', damping: 10, stiffness: 200 }}
               className="bg-action p-10 rounded-full shadow-[0_0_100px_rgba(0,240,255,0.8)]"
             >
                <ShoppingBag className="h-20 w-20 text-background" />
             </motion.div>
             
             <motion.h2 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="mt-10 text-6xl font-black text-white font-serif italic tracking-tighter"
             >
                Secured.
             </motion.h2>
             
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="mt-4 text-action font-black uppercase tracking-[0.5em] text-xs"
             >
                Notifying {brandName} in real-time
             </motion.p>

             {/* Dynamic Confetti Particles */}
             {confetti.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ 
                    x: c.x, 
                    y: 600, // Roughly bottom of screen
                    rotate: 0 
                  }}
                  animate={{ 
                    y: -100,
                    rotate: c.rotate + 360,
                  }}
                  transition={{ 
                    duration: c.duration, 
                    repeat: Infinity,
                    delay: c.delay,
                    ease: "linear" 
                  }}
                  className="absolute w-2 h-2 bg-action rounded-full"
                  style={{ left: '50%' }}
                />
             ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Phase 2: HUD Concierge (Personal Shopper PiP) */}
      <AnimatePresence>
        {isShopperActive && jitsiRoomId && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8, x: '80%', y: '-80%' }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-40 right-10 z-[100] w-[400px] h-[600px] bg-[#121212] rounded-[40px] border border-white/20 shadow-2xl overflow-hidden group"
          >
             <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setShopperActive(false)}
                  className="h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white"
                >
                   <X size={14} />
                </button>
             </div>
             
             {/* Draggable Handle */}
             <div className="absolute top-0 inset-x-0 h-8 bg-linear-to-b from-black/40 to-transparent cursor-move" />

             <div className="h-full w-full pointer-events-auto">
                <JitsiMeeting 
                  roomName={jitsiRoomId}
                  displayName="Fashionboxe Guest"
                  onClose={() => setShopperActive(false)}
                />
             </div>
             
             <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                <div className="flex items-center justify-between text-[6px] font-black uppercase tracking-widest text-white/40">
                   <span>SECURE CONCIERGE</span>
                   <div className="flex items-center gap-1 text-action">
                      <div className="h-1 w-1 rounded-full bg-action animate-pulse" />
                      LIVE
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Phase 3: Live Chat Engagement System */}
      <LiveChat brandName={brandName} />
    </div>
  );
}
