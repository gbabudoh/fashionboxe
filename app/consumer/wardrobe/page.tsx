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
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function ConsumerWardrobePage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearWardrobe } = useWardrobeStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

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
          },
        });
        clearWardrobe();
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
    } catch (error) {
      toast.error('GATEWAY CONNECTION ERROR', { id: loadingToast });
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter italic font-serif uppercase">My Wardrobe</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            {getTotalItems()} Items across {new Set(items.map(i => i.brandId)).size} concessions
          </p>
        </div>
        <Link href="/showrooms">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Continue Browsing
          </div>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main List */}
        <div className="flex-1 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-white/[0.02] rounded-[3rem] border border-white/5">
              <ShoppingBag className="h-12 w-12 text-white/10" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Your Wardrobe is currently empty.</p>
              <Link href="/showrooms">
                <button className="px-8 py-3 bg-white/10 hover:bg-accent hover:text-black rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">Start Discovering</button>
              </Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center gap-6 p-5 bg-white/[0.02] rounded-3xl border border-white/5"
                >
                  <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">{item.brand}</p>
                    <h3 className="text-lg font-black tracking-tight uppercase truncate text-white">{item.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                       <div className="flex items-center gap-4 bg-white/5 rounded-xl border border-white/10 p-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded-lg text-white/40 hover:text-white cursor-pointer"><Minus size={12} /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded-lg text-white/40 hover:text-white cursor-pointer"><Plus size={12} /></button>
                       </div>
                       <p className="font-black text-white">{typeof item.price === 'string' ? item.price : `$${item.price}`}</p>
                    </div>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Summary Side HUD */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 underline decoration-accent/40 underline-offset-4">Transaction Summary</h4>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/40">Investment</span>
                <span className="text-white">${getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/40">Shipping</span>
                <span className="text-accent italic">Complimentary</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-white">${getTotalPrice().toLocaleString()}</span>
              </div>
            </div>

            <button 
              disabled={items.length === 0 || isCheckingOut}
              onClick={handleCheckout}
              className="w-full bg-accent text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
               {isCheckingOut ? 'Routing...' : 'Initialize Purchase'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                <ShieldCheck size={14} className="text-accent" />
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest text-center">Encrypted Data</span>
             </div>
             <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                <Truck size={14} className="text-accent" />
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest text-center">Global Express</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
