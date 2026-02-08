import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orchestrator } from '@/lib/orchestrator';

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

    // 2. Decommission the instance via Orchestrator
    await orchestrator.decommissionInstance(brand.slug);

    // 3. Update brand status in Prisma
    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        status: 'OPEN', // Or 'CLOSED' depending on business logic, defaulting to OPEN.
        isLive: false,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } as any,
    });

    return NextResponse.json({
      message: 'Concession closed successfully!',
      brand: updatedBrand,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CLOSE_API] Error closing concession:', error);
    return NextResponse.json({ 
      error: 'Failed to close concession store',
      details: message 
    }, { status: 500 });
  }
}
