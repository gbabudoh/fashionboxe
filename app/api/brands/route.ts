import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const country = searchParams.get('country');
    const category = searchParams.get('category');

    const where: Prisma.BrandWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country && country !== 'Global') {
      where.country = country;
    }

    // Since category is currently a loose field (often mocked), we filter it if it exists in the schema
    // If not in schema, we can still filter after fetching, but here we assume it's in the DB or we handle it gracefully
    if (category && category !== 'All') {
      // If category is a field in your Prisma schema for Brand, use it:
      // where.category = category;
    }

    const brands = await prisma.brand.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        isLive: true,
        bannerUrl: true,
        logoUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedBrands = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      country: brand.country || 'Global',
      status: brand.isLive ? 'LIVE_STREAMING' : 'OPEN',
      isLive: brand.isLive,
      category: 'Luxury Fashion', // Fallback until category is added to schema
      image: brand.bannerUrl || brand.logoUrl || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    }));

    return NextResponse.json(formattedBrands);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json([], { status: 200 });
  }
}
