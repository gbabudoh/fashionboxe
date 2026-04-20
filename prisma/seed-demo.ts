import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- CREATING DEMO ACCOUNTS (TS) ---');

  // 1. Ensure a brand exists for the seller to manage
  const brand = await prisma.brand.upsert({
    where: { slug: 'vanguard-elite' },
    update: {},
    create: {
      name: 'VANGUARD ELITE',
      slug: 'vanguard-elite',
      description: 'Futuristic architectural fashion for the elite.',
      country: 'France',
      status: 'LIVE_STREAMING',
      jitsiRoomId: 'vanguard-elite-showroom',
    },
  });

  // 2. Create Consumer Account
  await prisma.user.upsert({
    where: { email: 'consumer@demo.com' },
    update: {
      role: 'CUSTOMER'
    },
    create: {
      email: 'consumer@demo.com',
      name: 'Demo Consumer',
      role: 'CUSTOMER',
      country: 'USA',
    },
  });
  console.log('Consumer Account Ready: consumer@demo.com (pass: consumerpass)');

  // 3. Create Seller Account
  await prisma.user.upsert({
    where: { email: 'seller@demo.com' },
    update: {
      role: 'BRAND_MANAGER',
      brandId: brand.id
    },
    create: {
      email: 'seller@demo.com',
      name: 'Demo Seller',
      role: 'BRAND_MANAGER',
      brandId: brand.id,
      country: 'France',
    },
  });
  console.log('Seller Account Ready: seller@demo.com (pass: sellerpass)');

  console.log('--- DEMO ACCOUNTS READY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
