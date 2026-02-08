const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brand = await prisma.brand.findUnique({
    where: { slug: 'midnight-bloom' },
    include: { products: true }
  });
  console.log('Brand:', brand ? brand.name : 'Not found');
  console.log('Products Count:', brand ? brand.products.length : 0);
  console.log('Products:', JSON.stringify(brand ? brand.products : [], null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
