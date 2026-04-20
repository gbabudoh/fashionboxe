const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING FASHIONBOXE IDENTITY CORE ---');

  // Create a Demo Brand
  const brand = await prisma.brand.upsert({
    where: { slug: 'lux-noir' },
    update: {},
    create: {
      name: 'LUX NOIR',
      slug: 'lux-noir',
      description: 'The epitome of cinematic dark fashion.',
      country: 'France',
      status: 'OPEN',
      primaryColor: '#0d0d0d',
      accentColor: '#d4af37',
      jitsiRoomId: 'lux-noir-private-showroom',
    },
  });

  console.log(`Brand Created: ${brand.name}`);

  // Create a Brand Manager User
  const manager = await prisma.user.upsert({
    where: { email: 'manager@luxnoir.com' },
    update: {},
    create: {
      email: 'manager@luxnoir.com',
      name: 'Julian Rose',
      role: 'BRAND_MANAGER',
      brandId: brand.id,
      country: 'France',
    },
  });

  console.log(`Manager Created: ${manager.name} (${manager.email})`);
  console.log('--- SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
