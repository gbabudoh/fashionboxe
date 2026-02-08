import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Brand } from '@prisma/client';
import { sendBrandAlert } from '@/lib/mattermost';

interface BrandExtended extends Brand {
  mattermostWebhookUrl: string | null;
}

/**
 * Handles "Virtual Try-On" interactions and sends notifications to the brand's Mattermost channel.
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, brandId } = await req.json();

    if (!productId || !brandId) {
      return NextResponse.json({ error: 'Missing productId or brandId' }, { status: 400 });
    }

    // 1. Fetch brand details for the webhook URL
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const brand = await (prisma.brand as any).findUnique({
      where: { id: brandId },
      select: { mattermostWebhookUrl: true, name: true }
    }) as BrandExtended | null;

    // 2. Fetch product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true }
    });

    if (!brand || !product) {
      return NextResponse.json({ error: 'Brand or Product not found' }, { status: 404 });
    }

    // 3. Send Mattermost Alert if configured
    if (brand.mattermostWebhookUrl) {
      await sendBrandAlert(brand.mattermostWebhookUrl, {
        type: 'TRY_ON',
        productName: product.name
      });
    }

    return NextResponse.json({ success: true, message: 'Interaction tracked and alerted.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[TRYON_API] Error handling interaction:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
