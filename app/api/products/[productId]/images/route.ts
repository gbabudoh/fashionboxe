import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/minioService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const result = await storage.uploadProductImage(productId, {
      originalname: file.name,
      buffer: buffer,
      size: file.size,
      mimetype: file.type
    });

    return NextResponse.json({
      success: true,
      image: result
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
