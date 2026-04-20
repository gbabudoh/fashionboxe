// Server-side API route for fetching brands with category filtering
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  isLive: boolean;
  status: string;
  category: string | null;
  bannerUrl: string | null;
  logoUrl: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const country = searchParams.get('country');
    const category = searchParams.get('category');

    const whereClause: Prisma.BrandWhereInput = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country && country !== 'Global') {
      whereClause.country = country;
    }

    // We merge the category filter if present. Since the Prisma types are currently
    // stale (locked by the dev server), we construct the final where object this way.
    const where = category && category !== 'All' 
      ? { ...whereClause, category } 
      : whereClause;

    // Construct fragments for optional filters
    const searchFilter = search 
      ? Prisma.sql`AND (name ILIKE ${'%' + search + '%'} OR slug ILIKE ${'%' + search + '%'})` 
      : Prisma.empty;
    const countryFilter = country && country !== 'Global' 
      ? Prisma.sql`AND country = ${country}` 
      : Prisma.empty;
    const categoryFilter = category && category !== 'All' 
      ? Prisma.sql`AND category = ${category}` 
      : Prisma.empty;

    const brands = await prisma.$queryRaw<BrandRecord[]>(
      Prisma.sql`
        SELECT 
          id, name, slug, country, "isLive", status, category, "bannerUrl", "logoUrl"
        FROM "Brand"
        WHERE 1=1
        ${searchFilter}
        ${countryFilter}
        ${categoryFilter}
        ORDER BY "createdAt" DESC
      `
    );

    const formattedBrands = brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      country: brand.country || 'Global',
      status: brand.status || (brand.isLive ? 'LIVE_STREAMING' : 'OPEN'),
      isLive: brand.isLive,
      category: brand.category || 'Apparel',
      image: brand.bannerUrl || brand.logoUrl || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    }));

    return NextResponse.json(formattedBrands);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json([], { status: 200 });
  }
}
