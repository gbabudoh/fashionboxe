'use client';

import React, { useState, ChangeEvent } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UploadResult {
    url: string;
    key: string;
    bucket: string;
}

interface FashionImageUploadProps {
    productId: string;
    onSuccess?: (image: UploadResult) => void;
}

const FashionImageUpload = ({ productId, onSuccess }: FashionImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            setUploadedFile(file);
        }
    };
    
    const handleUpload = async () => {
        if (!uploadedFile) return;
        setUploading(true);
        
        const formData = new FormData();
        formData.append('image', uploadedFile);
        
        try {
            const response = await fetch(`/api/products/${productId}/images`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                onSuccess?.(data.image);
                setPreview(null);
                setUploadedFile(null);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div className="w-full max-w-md mx-auto">
            <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${preview ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                {preview ? (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        <button 
                            onClick={() => { setPreview(null); setUploadedFile(null); }}
                            className="absolute top-4 right-4 bg-background/80 backdrop-blur-md p-2 rounded-full text-white hover:bg-background transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-accent/10 rounded-full text-accent">
                            <Upload size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold">Drop your latest look</p>
                            <p className="text-muted text-sm mt-1">PNG, JPG or WebP up to 10MB</p>
                        </div>
                        <label className="mt-2 cursor-pointer rounded-full bg-accent px-6 py-2 text-sm font-bold text-background hover:scale-105 transition-transform">
                            Select File
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </>
                )}
            </div>
            
            {preview && !uploading && (
                <button 
                    onClick={handleUpload}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-bold text-background hover:opacity-90 transition-opacity"
                >
                    <Upload size={18} />
                    Confirm & Upload to Runway
                </button>
            )}

            {uploading && (
                <div className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-white/5 py-4 text-sm font-bold text-white backdrop-blur-md">
                    <Loader2 size={18} className="animate-spin" />
                    Uploading High-Res Asset...
                </div>
            )}
        </div>
    );
};

export default FashionImageUpload;
