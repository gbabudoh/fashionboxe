import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProductForm from '@/components/dashboard/ProductForm';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewProductPage() {
  const brand = await prisma.brand.findFirst();

  if (!brand) return <div>Brand not found. Please setup concession first.</div>;

  return (
    <DashboardLayout>
      <div className="mb-10">
        <Link href="/dashboard/brand/products" className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-accent transition-colors">
          <ArrowLeft size={14} />
          Back to Runway
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-white">Create New Look</h1>
        <p className="mt-1 text-sm font-medium text-white/40">Detail your latest creation for the global audience.</p>
      </div>

      <ProductForm brandId={brand.id} />
    </DashboardLayout>
  );
}
