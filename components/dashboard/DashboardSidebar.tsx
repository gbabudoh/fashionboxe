'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ShoppingBag, Radio, LogOut, Heart, History, Sparkles } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const BRAND_NAV = [
  { name: 'Overview', href: '/dashboard/brand', icon: LayoutDashboard },
  { name: 'Concession Settings', href: '/dashboard/brand/concession', icon: Settings },
  { name: 'Product Runway', href: '/dashboard/brand/products', icon: ShoppingBag },
  { name: 'Live Stream', href: '/dashboard/brand/live', icon: Radio },
];

const CONSUMER_NAV = [
  { name: 'Identity Core', href: '/consumer', icon: LayoutDashboard },
  { name: 'My Wardrobe', href: '/consumer/wardrobe', icon: ShoppingBag },
  { name: 'Wishlist', href: '/consumer/wishlist', icon: Heart },
  { name: 'Order History', href: '/consumer/orders', icon: History },
  { name: 'Boutiques', href: '/consumer/boutiques', icon: Sparkles },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isBrandManager = session?.user?.role === 'BRAND_MANAGER';
  const navItems = isBrandManager ? BRAND_NAV : CONSUMER_NAV;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="flex h-20 items-center border-b border-white/5 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-accent" />
          <span className="text-lg font-black tracking-tighter text-white">FASHIONBOXE</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-accent text-background shadow-lg shadow-accent/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
