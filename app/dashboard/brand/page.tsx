import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Radio, Users, Eye, TrendingUp, ShoppingBag, Settings, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: LucideIcon, color: string }) => (
  <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
    <div className="mb-4 flex items-center justify-between">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Real-time</span>
    </div>
    <h3 className="text-sm font-bold text-white/60">{title}</h3>
    <p className="mt-1 text-2xl font-black text-white">{value}</p>
  </div>
);

export default async function BrandDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'BRAND_MANAGER') {
    redirect('/auth/signin');
  }

  const brandId = session.user.brandId as string;

  // Fetch real statistics
  const [productCount, totalSales, paidOrders] = await Promise.all([
    prisma.product.count({ where: { brandId } }),
    prisma.order.aggregate({
      where: { brandId, status: 'PAID' },
      _sum: { totalAmount: true }
    }),
    prisma.order.count({ where: { brandId, status: 'PAID' } })
  ]);

  const salesAmount = totalSales._sum.totalAmount?.toString() ?? "0";

  return (
    <DashboardLayout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic font-serif">IDENTITY CORE: {session.user.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Secure Concession Management Protocol</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 ring-1 ring-emerald-500/50">
            <Radio size={12} className="animate-pulse" />
            System Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`$${Number(salesAmount).toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500/20 text-emerald-500" />
        <StatCard title="Confirmed Sales" value={paidOrders.toString()} icon={Eye} color="bg-blue-500/20 text-blue-500" />
        <StatCard title="Active Streams" value="1" icon={Radio} color="bg-fuchsia-500/20 text-fuchsia-500" />
        <StatCard title="Runway Looks" value={productCount.toString()} icon={ShoppingBag} color="bg-accent/20 text-accent" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-[3.5rem] border border-white/5 bg-white/[0.02] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShoppingBag className="h-40 w-40 text-accent" />
          </div>
          <h2 className="text-xl font-black italic font-serif text-white mb-10 tracking-tight underline decoration-accent/20 underline-offset-8">COMMAND CENTER</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/dashboard/brand/products/new" className="group relative overflow-hidden rounded-[2rem] bg-accent p-8 text-background transition-all hover:scale-[1.02] active:scale-95">
              <ShoppingBag className="mb-4 h-6 w-6" />
              <p className="text-xl font-black leading-tight uppercase">Upload New<br />Runway Look</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                 Initialize Product Core
              </div>
            </Link>
            <Link href="/dashboard/brand/concession" className="group rounded-[2rem] bg-white/5 border border-white/10 p-8 text-white transition-all hover:bg-white/10">
              <Settings className="mb-4 h-6 w-6 text-accent" />
              <p className="text-xl font-black leading-tight uppercase">Concession<br />Parameters</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                 Configure Brand Identity
              </div>
            </Link>
          </div>
        </div>

        {/* Live Audience Sim */}
        <div className="rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-fuchsia/10 to-transparent p-10 flex flex-col justify-between">
           <div>
            <h2 className="text-xl font-black italic font-serif text-white mb-10 flex items-center gap-3">
                <Users size={24} className="text-fuchsia" />
                SENSORY ANALYTICS
            </h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  <span>Primary Region</span>
                  <span className="text-white">Milan, IT</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                   <div className="h-full w-2/3 bg-fuchsia shadow-[0_0_20px_rgba(255,0,255,0.4)]" />
                </div>
                <p className="text-[11px] font-medium text-white/30 leading-relaxed uppercase tracking-widest">
                   Runway collection is high-indexing for the Milan demographic. Deploy &quot;Spring &apos;26&quot; assets now.
                </p>
            </div>
           </div>
           
           <div className="mt-8 pt-8 border-t border-white/5">
              <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:bg-white/5 transition-all">
                 Download Intelligence Report
              </button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
