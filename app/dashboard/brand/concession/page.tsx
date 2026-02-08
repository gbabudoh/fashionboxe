import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConcessionSettingsForm from '@/components/dashboard/ConcessionSettingsForm';
import { prisma } from '@/lib/prisma';

export default async function ConcessionSettingsPage() {
  // In a real app, we would get the logged-in user's brandId
  // For demo, we'll use the first brand in the DB or a placeholder
  let brand = await prisma.brand.findFirst();

  if (!brand) {
    // Seed a dummy brand if none exists for demo purposes
    brand = await prisma.brand.create({
      data: {
        name: "Velvet & Vine",
        slug: "velvet-vine",
        description: "Luxury apparel for the modern runway.",
        country: "France",
        streamUrl: "https://demo.owncast.online/embed/video",
        jitsiRoomId: "fashionboxe-velvet-vine",
        isLive: false,
      }
    });
  }

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-white">Concession Settings</h1>
        <p className="mt-1 text-sm font-medium text-white/40">Manage your brand&apos;s presence and live commerce configuration.</p>
      </div>

      <ConcessionSettingsForm brand={brand} />
    </DashboardLayout>
  );
}
