import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.warn('[STRIPE] Warning: STRIPE_SECRET_KEY is not defined in environment variables.');
}

export const stripe = new Stripe(secretKey || 'missing_key', {
  typescript: true,
  apiVersion: '2026-01-28.clover', // Update to the version expected by the library types
});
