import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, eventData } = payload;

    if (type === 'STREAM_STARTED') {
      await prisma.brand.updateMany({
        where: { streamUrl: { contains: eventData.streamerName } },
        data: { 
          status: 'LIVE_STREAMING',
          isLive: true,
          lastLiveAt: new Date()
        } as unknown as Prisma.BrandUpdateInput,
      });
      revalidatePath('/');
    }

    if (type === 'STREAM_STOPPED') {
      await prisma.brand.updateMany({
        where: { streamUrl: { contains: eventData.streamerName } },
        data: { 
          status: 'OPEN',
          isLive: false 
        } as unknown as Prisma.BrandUpdateInput,
      });
      revalidatePath('/');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Owncast Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
