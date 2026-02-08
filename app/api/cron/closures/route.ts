import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany();
    const now = new Date();
    
    for (const brand of brands) {
      if (!brand.openingTime || !brand.closingTime) continue;

      // Simple time comparison logic (could be enhanced with Luxon for timezones)
      const [openH, openM] = brand.openingTime.split(':').map(Number);
      const [closeH, closeM] = brand.closingTime.split(':').map(Number);
      
      const currentH = now.getUTCHours(); // Assuming UTC for now, or use brand.timezone
      const currentM = now.getUTCMinutes();
      
      const currentTimeInMinutes = currentH * 60 + currentM;
      const openingTimeInMinutes = openH * 60 + openM;
      const closingTimeInMinutes = closeH * 60 + closeM;
      
      let newStatus: 'OPEN' | 'CLOSED' = 'CLOSED';
      
      if (currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes) {
        newStatus = 'OPEN';
      }

      // Don't override LIVE_STREAMING unless it's a hard closure
      if (brand.status !== 'LIVE_STREAMING' && brand.status !== newStatus) {
        await prisma.brand.update({
          where: { id: brand.id },
          data: { status: newStatus } as unknown as Prisma.BrandUpdateInput,
        });
      }
    }

    revalidatePath('/');
    return NextResponse.json({ success: true, processed: brands.length });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Closure check failed' }, { status: 500 });
  }
}
