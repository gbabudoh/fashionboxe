import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Radio, Users, Eye, TrendingUp, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: LucideIcon, color: string }) => (
  <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
    <div className="mb-4 flex items-center justify-between">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Last 24h</span>
    </div>
    <h3 className="text-sm font-bold text-white/60">{title}</h3>
    <p className="mt-1 text-2xl font-black text-white">{value}</p>
  </div>
);

export default function BrandDashboard() {
  return (
    <DashboardLayout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Brand Overview</h1>
          <p className="mt-1 text-sm font-medium text-white/40">Welcome back to your concession management center.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-fuchsia/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-fuchsia ring-1 ring-fuchsia/50">
            <Radio size={12} className="animate-pulse" />
            Standby for Stream
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sales" value="$42,390" icon={TrendingUp} color="bg-emerald-500/20 text-emerald-500" />
        <StatCard title="Store Visitors" value="12.4K" icon={Eye} color="bg-blue-500/20 text-blue-500" />
        <StatCard title="Active Streams" value="1" icon={Radio} color="bg-fuchsia-500/20 text-fuchsia-500" />
        <StatCard title="Total Products" value="24" icon={ShoppingBag} color="bg-accent/20 text-accent" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/dashboard/brand/products/new" className="group rounded-2xl bg-accent p-6 text-background transition-all hover:scale-105 active:scale-95">
              <ShoppingBag className="mb-3" />
              <p className="text-lg font-black leading-tight">Add New Look<br />to Runway</p>
            </Link>
            <Link href="/dashboard/brand/concession" className="group rounded-2xl bg-white/5 border border-white/10 p-6 text-white transition-all hover:bg-white/10">
              <Settings className="mb-3 text-accent" />
              <p className="text-lg font-black leading-tight">Update Concession<br />Settings</p>
            </Link>
          </div>
        </div>

        {/* Live Audience Sim */}
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-fuchsia/10 to-transparent p-8">
           <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-fuchsia" />
              Live Insights
           </h2>
           <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                <span>Top Region</span>
                <span className="text-white">Milan, IT</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                 <div className="h-full w-2/3 bg-fuchsia" />
              </div>
              <p className="text-xs text-muted leading-relaxed mt-4">
                 Your Spring collection is trending in Milan. Consider boosting your stream during the 6PM (CET) slot.
              </p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Settings } from 'lucide-react';
