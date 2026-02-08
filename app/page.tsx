import Image from "next/image";
import { Play, Users, Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOptimizedImageUrl } from "@/lib/imageHandler";
import HomeClient from "@/components/HomeClient";
import Header from "@/components/Header";
import { Suspense } from "react";
import { Brand, BrandStatus } from "@prisma/client";

// Local extension to bypass Prisma client type lag after schema updates
interface BrandExtended extends Brand {
  status: BrandStatus;
  mattermostWebhookUrl: string | null;
  stripeAccountId: string | null;
}

interface BrandUI {
  name: string;
  slug: string;
  category: string;
  image: string;
  isLive: boolean;
  status: string;
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ region?: string }> 
}) {
  const { region } = await searchParams;
  let brands: Brand[] = [];
  
  try {
    // Filter by country if selected and not Global
    const whereClause = region && region !== 'Global' 
      ? { country: region } 
      : {};

    brands = await prisma.brand.findMany({
      where: whereClause,
      take: 20,
      orderBy: { lastLiveAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    brands = [];
  }

  const processedBrands: BrandUI[] = brands.map((brand) => {
    const b = brand as BrandExtended;
    return {
      name: b.name,
      slug: b.slug,
      category: b.country || "Global Region",
      image: b.bannerUrl || b.logoUrl || "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=400",
      isLive: b.status === 'LIVE_STREAMING',
      status: String(b.status),
    };
  });

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header/Nav - Regionalized */}
      <Suspense fallback={<div className="h-20 bg-background/80 backdrop-blur-xl border-b border-white/5 fixed top-0 w-full z-50" />}>
        <Header />
      </Suspense>

      {/* Hero Section: Live Cinematic Stream */}
      <section className="relative h-[85vh] w-full pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/40" />
          
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute left-10 top-10 z-20 flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-full bg-fuchsia/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white ring-1 ring-white/20">
                <Radio className="h-3 w-3 animate-pulse" />
                Live Now: Spring Collection &apos;26
              </div>
              <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/90 ring-1 ring-white/10 cursor-default">
                <Users className="h-3 w-3" />
                12.4K Watching
              </div>
            </div>

            <Image 
              src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Live Fashion Show"
              fill
              className="object-cover opacity-60"
              priority
            />

            <HomeClient>
              <div className="absolute bottom-20 left-10 z-20 max-w-2xl">
                <h1 className="text-6xl font-black leading-[0.9] text-white md:text-8xl">
                  {region && region !== 'Global' ? region.toUpperCase() : 'CINEMATIC'}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-fuchsia to-accent bg-[length:200%_auto] animate-gradient">FASHION.</span>
                </h1>
                <p className="mt-6 text-lg font-medium text-white/60 md:text-xl">
                  Experience the runway in real-time. Shop direct from the stream with the world&apos;s most exclusive brands in {region || 'the Global Mall'}.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-black transition-all hover:bg-accent hover:scale-105 cursor-pointer">
                    <Play className="h-4 w-4 fill-current" />
                    Watch Live Feed
                  </button>
                  <button className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 cursor-pointer">
                    Explore Concessions
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </HomeClient>
          </div>
        </div>
      </section>

      {/* Brand Concessions Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Elite Showrooms</h2>
            <p className="mt-2 text-4xl font-black text-white">{region && region !== 'Global' ? `${region} Concessions` : 'The Global Mall'}</p>
          </div>
          <button className="text-sm font-bold text-white/40 hover:text-accent transition-colors cursor-pointer">View All Brands</button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {processedBrands.length > 0 ? processedBrands.map((brand: BrandUI, idx: number) => (
            <Link key={idx} href={`/brand/${brand.slug}`}>
              <div className="group relative cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-white/5 bg-secondary shadow-2xl">
                  <Image 
                    src={getOptimizedImageUrl(brand.image, 600, 800)}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                  
                  <div className="absolute left-6 top-6 flex flex-col gap-2">
                    {brand.isLive ? (
                      <div className="flex items-center gap-2 rounded-full bg-fuchsia px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-fuchsia/40">
                        <Radio className="h-2.5 w-2.5 animate-pulse" />
                        Live
                      </div>
                    ) : brand.status === 'CLOSED' ? (
                      <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white/40 ring-1 ring-white/10">
                        Closed
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[8px] font-black uppercase tracking-widest text-background shadow-lg shadow-accent/20">
                        Open
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">{brand.category}</p>
                    <h3 className="text-2xl font-black tracking-tight">{brand.name}</h3>
                    <div className="mt-4 flex translate-y-4 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-xs font-bold">Enter Showroom</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-white/40 font-medium">No concessions currently active in this region.</p>
              <Link href="/?region=Global" className="mt-4 inline-block text-accent text-sm font-bold hover:underline">Return to Global Mall</Link>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 bg-background py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 md:flex-row">
           <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-accent" />
            <span className="text-lg font-black tracking-tighter text-white">FASHIONBOXE</span>
          </div>
          <p className="text-xs text-white/20 font-medium tracking-tight">© 2026 Fashionboxe Concessions. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
