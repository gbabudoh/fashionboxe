import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Brand, BrandStatus } from '@prisma/client';
import { orchestrator } from '@/lib/orchestrator';

interface BrandExtended extends Brand {
  status: BrandStatus;
}

export async function POST(req: NextRequest) {
  try {
    const { brandId } = await req.json();

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
    }

    // 1. Fetch brand details
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // 2. Assign ports (In a real system, you'd pull these from a pool or config)
    // For prototype purposes, we generate something unique or use the brand's logic
    const basePort = 8000 + Math.floor(Math.random() * 1000);
    const webPort = basePort;
    const rtmpPort = 1935 + Math.floor(Math.random() * 100);

    // 3. Provision the instance via Orchestrator
    const streamDetails = await orchestrator.provisionInstance({
      brandId: brand.id,
      brandSlug: brand.slug,
      webPort,
      rtmpPort,
    });

    // 4. Update brand status and stream URL in Prisma
    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        status: BrandStatus.LIVE_STREAMING,
        isLive: true,
        streamUrl: streamDetails.streamUrl,
        lastLiveAt: new Date(),
      },
    }) as unknown as BrandExtended;

    return NextResponse.json({
      message: 'Concession launched successfully!',
      brand: updatedBrand,
      streamDetails,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[LAUNCH_API] Error launching concession:', error);
    return NextResponse.json({ 
      error: 'Failed to launch concession store',
      details: message 
    }, { status: 500 });
  }
}
