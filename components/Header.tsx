'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';
import CountrySelector from './CountrySelector';
import { useWardrobeStore } from '@/lib/store/useWardrobeStore';

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const currentRegion = searchParams.get('region') || 'Global';
  const [region, setRegion] = useState(currentRegion);
  const wardrobeCount = useWardrobeStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const params = new URLSearchParams(searchParams.toString());
    params.set('region', newRegion);
    router.push(`/?${params.toString()}`);
    localStorage.setItem('fb_preferred_region', newRegion);
  };

  useEffect(() => {
    const saved = localStorage.getItem('fb_preferred_region');
    if (saved && !searchParams.has('region')) {
       const params = new URLSearchParams(searchParams.toString());
       params.set('region', saved);
       router.replace(`/?${params.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 cursor-pointer">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-fuchsia shadow-lg shadow-accent/20" />
          <span className="text-2xl font-black tracking-tighter text-white">FASHIONBOXE</span>
        </Link>
        
        <div className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
          <Link href="/showrooms" className="hover:text-accent transition-colors cursor-pointer">Showrooms</Link>
          <Link href="/live" className="hover:text-accent transition-colors cursor-pointer">Live Now</Link>
          <Link href="/designers" className="hover:text-accent transition-colors cursor-pointer">Designers</Link>
          
          <Link href="/wardrobe" className="relative hover:text-accent transition-colors cursor-pointer flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Cart</span>
            {mounted && wardrobeCount > 0 && (
              <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-background ring-2 ring-background">
                {wardrobeCount}
              </span>
            )}
          </Link>
          
          <div className="h-6 w-px bg-white/10" />
          
          <CountrySelector 
            value={region} 
            onChange={handleRegionChange} 
            variant="dropdown"
          />

          {status === 'authenticated' ? (
            <div className="flex items-center gap-6">
              <Link 
                href={session?.user?.role === 'BRAND_MANAGER' ? '/dashboard/brand' : '/consumer'} 
                className="text-white/60 hover:text-accent flex items-center gap-2 transition-colors"
              >
                 <LayoutDashboard size={14} />
                 <span>{session?.user?.role === 'BRAND_MANAGER' ? 'Dashboard' : 'Identity Core'}</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-white/40 hover:text-fuchsia flex items-center gap-2 transition-colors cursor-pointer"
              >
                 <LogOut size={14} />
                 <span>Exit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/auth/signin" className="hover:text-accent transition-colors">Sign In</Link>
              <Link href="/auth/signup">
                <button className="rounded-full bg-white text-black px-6 py-2.5 text-xs font-bold shadow-lg hover:bg-accent hover:scale-105 transition-all active:scale-95 cursor-pointer">
                  Join Concession
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-4 md:hidden">
           <Link href="/wardrobe" className="relative p-2 text-white/60 hover:text-accent transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {mounted && wardrobeCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-background ring-2 ring-background">
                  {wardrobeCount}
                </span>
              )}
           </Link>
           <CountrySelector 
            value={region} 
            onChange={handleRegionChange} 
            variant="dropdown"
          />
        </div>
      </div>
    </nav>
  );
}
