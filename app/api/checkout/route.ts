import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { items }: { items: { id: string; quantity: number }[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Fetch all products with their brands
    let products = await prisma.product.findMany({
      where: {
        id: { in: items.map(i => i.id).filter(id => !id.startsWith('demo-')) }
      },
      include: { brand: true }
    });

    // Handle Demo Products for immersive demo experience
    const demoItems = items.filter(i => i.id.startsWith('demo-'));
    if (demoItems.length > 0) {
      const demoProducts = demoItems.map(item => ({
        id: item.id,
        name: item.id === 'demo-1' ? 'LADY SHADOW CLUTCH' : 'MIDNIGHT BLOOM VELVET',
        price: item.id === 'demo-1' ? 1250 : 4800,
        currency: 'USD',
        images: [item.id === 'demo-1' ? 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg' : 'https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg'],
        brandId: 'demo-brand',
        brand: {
          id: 'demo-brand',
          name: 'Demo Luxe',
          stripeAccountId: null,
          mattermostWebhookUrl: null,
        }
      }));
      // @ts-expect-error - Mocking Prisma type for demo
      products = [...products, ...demoProducts];
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'No valid products found' }, { status: 404 });
    }

    // Map items to quantities for easy lookup
    const itemMap = new Map(items.map(i => [i.id, i.quantity]));

    // Check if all products have brands and stripe IDs
    const brands = new Set(products.map(p => p.brandId));
    const isSingleBrand = brands.size === 1;
    const firstProduct = products[0];

    // Create line items for Stripe
    const lineItems: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(product => {
      const quantity = itemMap.get(product.id) || 1;
      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            images: product.images,
            metadata: {
              brandId: product.brandId,
              brandName: product.brand.name
            }
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity,
      };
    });

    const totalAmount = lineItems.reduce((acc, item) => {
      const unitAmount = item.price_data?.unit_amount || 0;
      const quantity = item.quantity || 0;
      return acc + (unitAmount * quantity);
    }, 0);
    
    // Platform Fee: 10%
    const applicationFee = Math.round(totalAmount * 0.10);

    const sessionOptions: import('stripe').Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/wardrobe?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/wardrobe?canceled=true`,
    };

    // If it's a single brand, we can use direct transfer_data
    if (isSingleBrand && firstProduct.brand.stripeAccountId) {
      sessionOptions.payment_intent_data = {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: firstProduct.brand.stripeAccountId,
        },
      };
    } else {
      // For multi-brand, we use transfer_group and will handle split transfers via webhooks/manual
      // In a production app, we would use a more complex logic here
      sessionOptions.payment_intent_data = {
         transfer_group: `ORDER-${Date.now()}`,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    // Notify all involved brands via Mattermost
    for (const brand of new Set(products.map(p => p.brand))) {
      if (brand.mattermostWebhookUrl) {
        const brandProducts = products.filter(p => p.brandId === brand.id);
        const { sendBrandAlert } = await import('@/lib/mattermost');
        await sendBrandAlert(brand.mattermostWebhookUrl, {
          type: 'PURCHASE',
          productName: brandProducts.map(p => `${p.name} (x${itemMap.get(p.id)})`).join(', '),
          price: brandProducts.reduce((acc, p) => acc + (Number(p.price) * (itemMap.get(p.id) || 1)), 0).toFixed(2),
        });
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
