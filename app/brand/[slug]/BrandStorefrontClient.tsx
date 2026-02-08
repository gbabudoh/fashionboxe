'use client';

import React from 'react';
import { Video } from 'lucide-react';
import { useLiveStore } from '@/lib/store/useLiveStore';

interface BrandStorefrontClientProps {
  brandName: string;
  brandId: string;
  jitsiRoomId: string;
}

export default function BrandStorefrontClient({ brandName, brandId, jitsiRoomId }: BrandStorefrontClientProps) {
  const isShopperActive = useLiveStore((state) => state.isShopperActive);
  const setShopperActive = useLiveStore((state) => state.setShopperActive);

  const handleRequestShopper = async () => {
    setShopperActive(true, jitsiRoomId, brandName);
    try {
      await fetch('/api/interactions/shopper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, roomId: jitsiRoomId }),
      });
    } catch (error) {
      console.error('[STOREFRONT_CLIENT] Failed to trigger shopper request:', error);
    }
  };

  if (isShopperActive) return null;

  return (
    <button 
      onClick={handleRequestShopper}
      className="group relative flex items-center justify-center gap-4 overflow-hidden rounded-full bg-accent px-20 py-2.5 text-[11px] font-black uppercase tracking-[0.3em] text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(212,175,55,0.3)] active:scale-95 cursor-pointer min-w-[320px]"
    >
      <div className="relative z-10 flex items-center gap-3">
        <Video className="h-4 w-4" />
        <span className="whitespace-nowrap">Join Meeting</span>
      </div>
      
      {/* Cinematic Shine Effect */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </button>
  );
}
