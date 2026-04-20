'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, User, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a production app, we would call an API route here to create the user
      // For now, we simulate success and redirect to sign in
      setTimeout(() => {
        toast.success('ENROLLMENT SUCCESSFUL. INITIALIZING IDENTITY.', {
          style: {
             background: '#000',
             color: '#d4af37',
             border: '1px solid rgba(212,175,55,0.2)',
             fontSize: '10px',
             fontWeight: '900',
             textTransform: 'uppercase'
          }
        });
        router.push('/auth/signin');
      }, 1500);
    } catch (error) {
      toast.error('ENROLLMENT FAILED. SYSTEM OVERLOAD.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-fuchsia p-px transition-transform group-hover:scale-110">
              <div className="h-full w-full bg-background rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white italic font-serif">FASHIONBOXE</span>
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Join Concession</h1>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Identity Enrollment Protocol</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Legal Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="ALEXANDER VOGUE"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email Protocol</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-fuchsia transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@concession.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-fuchsia/40 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-accent transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  REQUEST ACCESS
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
               Already established?
             </p>
             <Link href="/auth/signin" className="text-[10px] font-black text-fuchsia uppercase tracking-widest hover:text-white transition-colors">
               RETURN TO CONNECTION PROTOCOL
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
