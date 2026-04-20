'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateBrandSettings(brandId: string, data: {
  name?: string;
  description?: string;
  country?: string;
  streamUrl?: string;
  isLive?: boolean;
  primaryColor?: string;
  accentColor?: string;
  livekitRoomId?: string;
  openingTime?: string;
  closingTime?: string;
  mattermostWebhookUrl?: string;
}) {
  try {
    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        ...data,
      },
    });

    revalidatePath(`/dashboard/brand`);
    revalidatePath(`/dashboard/brand/concession`);
    revalidatePath(`/brand/${brand.slug}`);

    return { success: true, brand };
  } catch (error: unknown) {
    console.error('Failed to update brand settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  brandId: string;
  images: string[];
}) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        brandId: data.brandId,
        images: data.images,
      },
    });

    revalidatePath(`/dashboard/brand/products`);
    const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
    if (brand) revalidatePath(`/brand/${brand.slug}`);

    return { success: true, product };
  } catch (error: unknown) {
    console.error('Failed to create product:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath(`/dashboard/brand/products`);
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to delete product:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
