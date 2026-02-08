'use client';

import React, { useState } from 'react';
import { updateBrandSettings } from '@/app/actions/brand';
import { Radio, Save, Loader2, Link as LinkIcon, Palette } from 'lucide-react';

import CountrySelector from '@/components/CountrySelector';

interface ConcessionSettingsFormProps {
  brand: {
    id: string;
    name: string;
    description: string | null;
    country: string | null;
    streamUrl: string | null;
    isLive: boolean;
    primaryColor: string | null;
    accentColor: string | null;
    jitsiRoomId: string | null;
    openingTime: string | null;
    closingTime: string | null;
    mattermostWebhookUrl: string | null;
  };
}

const ConcessionSettingsForm = ({ brand }: ConcessionSettingsFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: brand.name,
    description: brand.description || '',
    country: brand.country || 'Global',
    streamUrl: brand.streamUrl || '',
    isLive: brand.isLive,
    primaryColor: brand.primaryColor || '#0D0D0D',
    accentColor: brand.accentColor || '#D4AF37',
    jitsiRoomId: brand.jitsiRoomId || '',
    openingTime: brand.openingTime || '',
    closingTime: brand.closingTime || '',
    mattermostWebhookUrl: brand.mattermostWebhookUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateBrandSettings(brand.id, formData);
    
    if (result.success) {
      alert('Settings updated successfully!');
    } else {
      alert('Failed to update settings: ' + result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Stream Control Section */}
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="rounded-xl bg-fuchsia/20 p-2 text-fuchsia">
                <Radio size={20} />
             </div>
             <h2 className="text-xl font-bold text-white">Stream Configuration</h2>
          </div>
          <button 
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isLive: !prev.isLive }))}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              formData.isLive 
                ? 'bg-fuchsia text-white shadow-lg shadow-fuchsia/40' 
                : 'bg-white/10 text-white/40 ring-1 ring-white/10'
            }`}
          >
            {formData.isLive ? 'Live On Runway' : 'Standby Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Owncast Stream URL (HLS/RTMP)</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                value={formData.streamUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, streamUrl: e.target.value }))}
                placeholder="https://your-stream.online/hls/live.m3u8"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Virtual Personal Shopper Room</label>
            <div className="relative">
              <Radio className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                value={formData.jitsiRoomId}
                onChange={(e) => setFormData(prev => ({ ...prev, jitsiRoomId: e.target.value }))}
                placeholder="fashionboxe-your-brand"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Identity Section */}
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
        <div className="mb-6 flex items-center gap-3">
           <div className="rounded-xl bg-accent/20 p-2 text-accent">
              <Palette size={20} />
           </div>
           <h2 className="text-xl font-bold text-white">Concession Identity</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Brand Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Headquarters / Region</label>
            <CountrySelector 
              value={formData.country} 
              onChange={(value) => setFormData(prev => ({ ...prev, country: value }))} 
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Opening Time</label>
              <input 
                type="time"
                value={formData.openingTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, openingTime: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Closing Time</label>
              <input 
                type="time"
                value={formData.closingTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, closingTime: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Mattermost Webhook URL</label>
            <input 
              type="url"
              placeholder="https://chat.fashionboxe.com/hooks/..."
              value={formData.mattermostWebhookUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, mattermostWebhookUrl: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Short Description</label>
            <textarea 
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-6 text-sm text-white focus:border-accent/40 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-6 border-t border-white/5">
             <h3 className="text-sm font-bold text-white mb-4">Financial Infrastructure</h3>
             <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-bold text-white">Stripe Connect</p>
                     <p className="text-xs text-white/40 max-w-xs mt-1">
                       Link your bank account to receive payouts from your concession sales globally.
                     </p>
                   </div>
                   <button 
                     type="button"
                     onClick={async () => {
                        try {
                          setLoading(true);
                          const res = await fetch('/api/stripe/connect', {
                            method: 'POST',
                            body: JSON.stringify({ brandId: brand.id }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            alert('Failed to start onboarding');
                          }
                        } catch (err) {
                           console.error(err);
                           alert('Error connecting to Stripe');
                        } finally {
                          setLoading(false);
                        }
                     }}
                     className="rounded-full bg-[#635BFF] px-6 py-3 text-xs font-bold text-white hover:bg-[#534be0] transition-colors"
                   >
                     {loading ? <Loader2 className="animate-spin" size={16} /> : "Connect Stripe"}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-accent px-10 py-5 text-sm font-black text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Publish Changes to Runway
        </button>
      </div>
    </form>
  );
};

export default ConcessionSettingsForm;
