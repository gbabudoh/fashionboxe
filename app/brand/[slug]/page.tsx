import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import LivePlayer from '@/components/LivePlayer';
import BrandStorefrontClient from './BrandStorefrontClient';
import { notFound } from 'next/navigation';

export default async function BrandStorefront({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!brand) {
    notFound();
  }

  // Map Prisma products to the format expected by LivePlayer
  let processedProducts = brand.products.map((p, idx) => ({
    id: p.id,
    name: p.name,
    price: p.price.toString(),
    image: p.images[0] || "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: p.category || "Luxury Fashion",
    // Mock hotspots for the "Digital Store" experience if not in DB for demonstration
    hotspots: (p as unknown as { hotspots: { x: number; y: number } }).hotspots || (idx === 0 ? { x: 30, y: 45 } : idx === 1 ? { x: 70, y: 35 } : undefined)
  }));

  // DEMO MODE: If no products, inject stunning high-fidelity demo items
  if (processedProducts.length === 0) {
    processedProducts = [
      {
        id: "demo-1",
        name: "LADY SHADOW CLUTCH",
        price: "1,250",
        image: "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Evening Essentials",
        hotspots: { x: 30, y: 45 }
      },
      {
        id: "demo-2",
        name: "MIDNIGHT BLOOM VELVET",
        price: "4,800",
        image: "https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg?auto=compress&cs=tinysrgb&w=600",
        category: "Runway Collection",
        hotspots: { x: 70, y: 35 }
      }
    ];
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Cinematic HUD Layer: Full-bleed Stream */}
      <div className="absolute inset-0 z-0">
        <LivePlayer 
          streamUrl={brand.streamUrl || "https://demo.owncast.online"}
          brandName={brand.name}
          brandId={brand.id}
          products={processedProducts}
        />
      </div>

      {/* Navigation HUD Overlay */}
      <nav className="fixed top-0 z-50 w-full bg-linear-to-b from-black/60 to-transparent">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-10">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:scale-110 transition-transform">
              <span className="text-2xl font-black tracking-[0.2em] text-accent font-serif italic">FASHIONBOXE</span>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-white/40 mb-0.5">Showroom</span>
              <span className="text-sm font-bold text-white tracking-wide">{brand.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-white uppercase leading-none">Live NOW</span>
             </div>
             
             <div className="h-10 w-px bg-white/10" />

             <Link href="/wardrobe" className="flex items-center gap-3 group/cart cursor-pointer">
                <div className="relative h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/cart:bg-accent group-hover/cart:text-background transition-all">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="hidden sm:flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/cart:text-accent transition-colors">My Cart</span>
                   <span className="text-xs font-bold text-white tracking-widest">WARDROBE</span>
                </div>
             </Link>

             <div className="h-10 w-px bg-white/10" />
            <Link href="/" className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all overflow-hidden">
               <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors" />
               <X className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>
      </nav>

      {/* VIP & Interactive HUD Trigger Overlay */}
      <div className="absolute right-10 top-48 z-40 flex flex-col gap-6">
        <BrandStorefrontClient 
          brandName={brand.name} 
          brandId={brand.id}
          jitsiRoomId={brand.jitsiRoomId || `fb-${brand.slug}`} 
        />
      </div>

      {/* Subtle Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
