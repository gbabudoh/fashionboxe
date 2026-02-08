/**
 * Media Strategy: imgproxy Utility
 * This utility wraps MinIO URLs with imgproxy transformation paths.
 */

const IMGPROXY_URL = process.env.IMGPROXY_URL || 'http://localhost:8080';
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost:9000';

export function getOptimizedImageUrl(
  originalUrl: string, 
  width: number = 800, 
  height: number = 600, 
  fit: 'cover' | 'contain' | 'fill' = 'cover'
) {
  if (!originalUrl) return '';

  // If it's already an external URL, just return it
  if (originalUrl.startsWith('http') && !originalUrl.includes(MINIO_ENDPOINT)) {
    return originalUrl;
  }

  // 1. Base64 encode the source URL for imgproxy if necessary
  // Standard format: /processing_options/source_url
  
  // Example implementation for plain paths (assuming imgproxy is configured for MinIO)
  const options = `rs:${fit}:${width}:${height}:0/g:sm`;
  const format = 'webp';

  // In a real production setup, you would sign this URL with a key/salt
  return `${IMGPROXY_URL}/${options}/${Buffer.from(originalUrl).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}.${format}`;
}
