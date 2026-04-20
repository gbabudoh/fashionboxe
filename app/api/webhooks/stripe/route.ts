import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: unknown) {
    const error = err as Error;
    // If we don't have a secret yet (dev mode without Stripe CLI), let's allow it but log a warning
    // In production, this should always fail if signature is invalid
    if (!process.env.STRIPE_WEBHOOK_SECRET && process.env.NODE_ENV === 'development') {
      console.warn('[WEBHOOK] Skipping signature verification in development without secret.');
      event = JSON.parse(body);
    } else {
      console.error(`[WEBHOOK] Signature verification failed: ${error.message}`);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const orderId = session.metadata?.orderId;
    const customerEmail = session.customer_details?.email;

    if (orderId) {
      console.log(`[WEBHOOK] Processing completed checkout for Order: ${orderId}`);
      
      // Update Order Status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          customerEmail: customerEmail || 'unknown@customer.com',
        },
      });

      // Implement Inventory Management
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
      });

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      console.log(`[WEBHOOK] Order ${orderId} finalized and inventory updated.`);
    }
  }

  return NextResponse.json({ received: true });
}
