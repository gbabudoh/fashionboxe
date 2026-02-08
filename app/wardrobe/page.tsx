'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  ShieldCheck,
  Truck,
  Zap
} from 'lucide-react';
import { useWardrobeStore } from '@/lib/store/useWardrobeStore';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function WardrobePage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearWardrobe } = useWardrobeStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const searchParams = useSearchParams();

  // Hydration fix for Persist middleware
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle post-checkout logic
  useEffect(() => {
    if (mounted) {
      if (searchParams.get('success') === 'true') {
        toast.success('ORDER AUTHENTICATED. WARDROBE CLEAR.', {
          style: {
            background: '#000',
            color: '#d4af37',
            border: '1px solid rgba(212,175,55,0.2)',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
        });
        clearWardrobe();
      } else if (searchParams.get('canceled') === 'true') {
        toast.error('TRANSACTION ABORTED.', {
          style: {
            background: '#000',
            color: '#ff0000',
            border: '1px solid rgba(255,0,0,0.2)',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
        });
      }
    }
  }, [mounted, searchParams, clearWardrobe]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    const loadingToast = toast.loading('ROUTING TO SECURE GATEWAY...', {
        style: {
            background: '#000',
            color: '#d4af37',
            border: '1px solid rgba(212,175,55,0.2)',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
        },
    });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: items.map(item => ({ id: item.id, quantity: item.quantity })) 
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (error: unknown) {
      console.error('[WARDROBE] Checkout error:', error);
      const message = error instanceof Error ? error.message : 'GATEWAY CONNECTION ERROR';
      toast.error(message, { id: loadingToast });
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />
      
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Main Wardrobe List */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-5xl font-black tracking-tighter italic font-serif">MY CART</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  {getTotalItems()} Items across {new Set(items.map(i => i.brandId)).size} concessions
                </p>
              </div>
              <Link href="/designers">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Browsing
                </div>
              </Link>
            </div>

            <div className="h-px w-full bg-white/5" />

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-8 bg-white/[0.02] rounded-[3rem] border border-white/5">
                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <ShoppingBag className="h-10 w-10 text-white/20" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Wardrobe is empty</h3>
                  <p className="text-sm text-white/40 max-w-xs mx-auto">Discover exclusive pieces from our world-class designers to fill your wardrobe.</p>
                </div>
                <Link href="/designers">
                  <button className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors cursor-pointer">
                    Explore Designers
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex flex-col sm:flex-row items-center gap-8 p-6 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="relative h-40 w-40 rounded-3xl overflow-hidden border border-white/10 shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 py-2">
                        <div className="flex flex-col gap-1 mb-4">
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest">{item.designer || item.brand}</p>
                          <h3 className="text-2xl font-black tracking-tight uppercase truncate">{item.name}</h3>
                          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{item.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center p-2 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold text-white/40 mb-1">Price</p>
                             <p className="text-xl font-black tracking-tighter">
                                {typeof item.price === 'string' ? item.price : `$${item.price}`}
                             </p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Checkout Summary Card */}
          <div className="w-full md:w-[400px] shrink-0">
            <div className="sticky top-32 space-y-6">
              <div className="p-10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Zap className="h-32 w-32 text-accent" />
                </div>
                
                <h3 className="text-xl font-black italic font-serif mb-10 tracking-tight underline decoration-accent/40 underline-offset-8">SUMMARY</h3>
                
                <div className="space-y-6 mb-12">
                   <div className="flex items-center justify-between text-white/40 font-medium">
                      <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                      <span className="text-sm font-bold">${getTotalPrice().toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between text-white/40 font-medium">
                      <span className="text-[10px] font-black uppercase tracking-widest">Luxury Logistics</span>
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest">Complimentary</span>
                   </div>
                   <div className="h-px w-full bg-white/5" />
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Investment</span>
                      <span className="text-3xl font-black tracking-tighter">${getTotalPrice().toLocaleString()}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <button 
                    disabled={items.length === 0 || isCheckingOut}
                    onClick={handleCheckout}
                    className="w-full bg-accent text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {isCheckingOut ? 'Rerouting...' : 'Secure Purchase'}
                  </button>
                  <p className="text-[8px] font-black text-white/20 text-center uppercase tracking-widest">
                    Multi-Concession Routing v0.2
                  </p>
                </div>
              </div>

              {/* Trust HUD */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center">Encrypted Transaction</span>
                 </div>
                 <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col items-center gap-3">
                    <Truck className="h-5 w-5 text-accent" />
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center">Express Global Delivery</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
