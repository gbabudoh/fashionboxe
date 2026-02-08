import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, MoreVertical, Search, Filter, ShoppingBag } from 'lucide-react';
import type { Product } from '@prisma/client';

export default async function ProductRunwayPage() {
  // Demo: Get first brand's products
  const brand = await prisma.brand.findFirst();
  const products = brand ? await prisma.product.findMany({
    where: { brandId: brand.id },
    orderBy: { createdAt: 'desc' }
  }) : [];

  return (
    <DashboardLayout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Product Runway</h1>
          <p className="mt-1 text-sm font-medium text-white/40">Manage your high-fidelity collection and inventory.</p>
        </div>
        <Link 
          href="/dashboard/brand/products/new"
          className="flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Add New Look
        </Link>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
        {/* Table Filters */}
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Search collection..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-xs text-white focus:border-accent/40 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-white/60 hover:text-white transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Product Grid/Table */}
        <div className="p-6">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <div key={product.id} className="group relative rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-accent/30">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary mb-4">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/5">
                        <ShoppingBag className="text-white/10" size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="rounded-full bg-black/60 backdrop-blur-md p-2 text-white hover:text-accent">
                          <MoreVertical size={16} />
                       </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-black text-white">${Number(product.price).toFixed(2)}</span>
                      <span className={`rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                        product.stock > 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {product.stock > 0 ? `${product.stock} In Stock` : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="mb-6 rounded-full bg-white/5 p-8 text-white/10">
                  <ShoppingBag size={64} />
               </div>
               <h3 className="text-xl font-bold text-white">No products yet</h3>
               <p className="mt-2 text-sm text-white/40 max-w-xs mx-auto">
                 Your runway is empty. Start by adding high-fidelity looks to your concession.
               </p>
               <Link 
                href="/dashboard/brand/products/new"
                className="mt-8 flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-6 py-3 text-xs font-black text-accent transition-all hover:bg-accent hover:text-background"
               >
                 Create First Look
               </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
