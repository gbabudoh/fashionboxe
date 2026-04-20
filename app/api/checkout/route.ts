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
    
    // Create the Order in our database first (PENDING)
    const order = await prisma.order.create({
      data: {
        customerEmail: 'pending@fashionboxe.com', // To be updated by webhook
        totalAmount: totalAmount / 100,
        status: 'PENDING',
        brandId: isSingleBrand ? (firstProduct.brandId as string) : 'multi-brand', // Adjusted for multi-brand
        items: {
          create: products.map(p => ({
            productId: p.id,
            quantity: itemMap.get(p.id) || 1,
            price: Number(p.price)
          }))
        }
      }
    });

    // Platform Fee: 10%
    const applicationFee = Math.round(totalAmount * 0.10);

    const sessionOptions: import('stripe').Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/wardrobe?success=true&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/wardrobe?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    };

    // If it's a single brand, we can use direct transfer_data
    if (isSingleBrand && firstProduct.brand.stripeAccountId && firstProduct.brandId !== 'demo-brand') {
      sessionOptions.payment_intent_data = {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: firstProduct.brand.stripeAccountId,
        },
        metadata: {
          orderId: order.id
        }
      };
    } else {
      sessionOptions.payment_intent_data = {
         transfer_group: `ORDER-${order.id}`,
         metadata: {
          orderId: order.id
         }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    // Update order with Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    // Notify all involved brands via Mattermost
    for (const brand of new Set(products.map(p => p.brand))) {
      // (Mattermost notification logic remains same, but using real brand IDs)
      if (brand.id !== 'demo-brand' && brand.mattermostWebhookUrl) {
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
