const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brands = [
    {
      name: 'Vanguard Elite',
      slug: 'vanguard-elite',
      country: 'France',
      status: 'LIVE_STREAMING',
      isLive: true,
      description: 'High-end avant-garde apparel from the heart of Paris.',
      streamUrl: 'https://demo.owncast.online', // Keeping for structure, but component will now fallback
      bannerUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      name: 'Aetheris Gold',
      slug: 'aetheris-gold',
      country: 'Italy',
      status: 'OPEN',
      isLive: false,
      description: 'Exquisite timepieces and jewelry crafted in Milan.',
      bannerUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      name: 'Midnight Bloom',
      slug: 'midnight-bloom',
      country: 'United Kingdom',
      status: 'OPEN',
      isLive: false,
      description: 'Bespoke accessories and leather goods from London.',
      bannerUrl: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1200'
    }
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    console.log(`Upserted brand: ${brand.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
