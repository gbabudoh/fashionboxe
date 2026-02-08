import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Brand } from '@prisma/client';
import { sendBrandAlert } from '@/lib/mattermost';

interface BrandExtended extends Brand {
  mattermostWebhookUrl: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const { brandId, roomId } = await req.json();

    if (!brandId || !roomId) {
      return NextResponse.json({ error: 'Missing brandId or roomId' }, { status: 400 });
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const brand = await (prisma.brand as any).findUnique({
      where: { id: brandId },
      select: { mattermostWebhookUrl: true }
    }) as BrandExtended | null;

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    if (brand.mattermostWebhookUrl) {
      await sendBrandAlert(brand.mattermostWebhookUrl, {
        type: 'VIP_REQUEST',
        roomId
      });
    }

    return NextResponse.json({ success: true, message: 'VIP request sent to creator.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SHOPPER_API] Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
