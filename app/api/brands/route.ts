import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
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
      category: 'Luxury Fashion',
      image: brand.bannerUrl || brand.logoUrl || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    }));

    return NextResponse.json(formattedBrands);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json([], { status: 200 });
  }
}
