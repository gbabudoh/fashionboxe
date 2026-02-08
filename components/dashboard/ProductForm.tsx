'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { createProduct } from '@/app/actions/brand';
import FashionImageUpload from '@/components/FashionImageUpload';
import { ShoppingBag, Save, X, Loader2, Tag, DollarSign, Package } from 'lucide-react';

interface ProductFormProps {
  brandId: string;
}

const ProductForm = ({ brandId }: ProductFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleUploadComplete = (result: { url: string }) => {
    setImages(prev => [...prev, result.url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }

    setLoading(true);
    
    const result = await createProduct({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      brandId,
      images,
    });
    
    if (result.success) {
      router.push('/dashboard/brand/products');
      router.refresh();
    } else {
      alert('Failed to create product: ' + result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col: Form Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent" />
            Vibe & Details
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Product Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Midnight Silk Gala Dress"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none placeholder:text-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Runway Description (Storytelling)</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the silhouette, fabric, and inspiration..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none resize-none placeholder:text-white/10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Price (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white focus:border-accent/40 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Collection Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    required
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Evening Wear"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white focus:border-accent/40 focus:outline-none placeholder:text-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Initial Stock</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    required
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white focus:border-accent/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Image Upload */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
           <h2 className="text-xl font-bold text-white mb-6">High-Fidelity Assets</h2>
           <FashionImageUpload 
            productId="temporary" 
            onSuccess={(result) => handleUploadComplete(result)}
           />
           
           {images.length > 0 && (
             <div className="mt-6 grid grid-cols-2 gap-2">
                {images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-secondary">
                    <NextImage 
                      src={url} 
                      alt="Uploaded asset" 
                      fill 
                      className="object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 z-10 rounded-full bg-black/60 p-1 text-white hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
             </div>
           )}
        </div>

        <div className="flex flex-col gap-4">
           <button 
             disabled={loading}
             className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-5 text-sm font-black text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             Publish to Runway
           </button>
           <button 
             type="button"
             onClick={() => router.back()}
             className="w-full rounded-full border border-white/10 bg-white/5 py-5 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
           >
             Cancel
           </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
