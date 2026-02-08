import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!
});

const bucketName = process.env.MINIO_BUCKET || 'fashionboxe';

interface UploadParams {
    originalname: string;
    buffer: Buffer;
    size: number;
    mimetype: string;
}

class FashionBoxeStorage {
    
    // Upload product image
    async uploadProductImage(productId: string, file: UploadParams) {
        const fileName = `products/${productId}/${Date.now()}-${file.originalname}`;
        
        await minioClient.putObject(
            bucketName,
            fileName,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );
        
        return {
            url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`,
            key: fileName,
            bucket: bucketName
        };
    }
    
    // Upload designer portfolio
    async uploadDesignerImage(designerId: string, file: UploadParams) {
        const fileName = `designers/${designerId}/${Date.now()}-${file.originalname}`;
        
        await minioClient.putObject(
            bucketName,
            fileName,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );
        
        return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }
    
    // Upload lookbook
    async uploadLookbook(collectionId: string, file: Omit<UploadParams, 'mimetype'> & { mimetype?: string }) {
        const fileName = `lookbooks/${collectionId}/${Date.now()}-${file.originalname}`;
        
        await minioClient.putObject(
            bucketName,
            fileName,
            file.buffer,
            file.size,
            file.mimetype ? { 'Content-Type': file.mimetype } : undefined
        );
        
        return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }
    
    // Get optimized image URL (with imgproxy)
    getOptimizedUrl(imageUrl: string, width = 800, height = 600) {
        const encodedUrl = Buffer.from(imageUrl).toString('base64url');
        return `http://localhost:8080/insecure/resize:fit:${width}:${height}/${encodedUrl}`;
    }
    
    // Delete image
    async deleteImage(key: string) {
        await minioClient.removeObject(bucketName, key);
    }
    
    // List all product images
    async listProductImages(productId: string) {
        const prefix = `products/${productId}/`;
        const images: { key: string; url: string; size: number; lastModified: Date }[] = [];
        
        const stream = minioClient.listObjectsV2(bucketName, prefix, true);
        
        for await (const obj of stream) {
            images.push({
                key: obj.name,
                url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${obj.name}`,
                size: obj.size,
                lastModified: obj.lastModified
            });
        }
        
        return images;
    }
}

const storage = new FashionBoxeStorage();
export default storage;
