'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { useChatStore } from '@/lib/store/useChatStore';

interface LiveChatProps {
  brandName: string;
}

export default function LiveChat({ brandName }: LiveChatProps) {
  const { messages, sendMessage, isOpen, toggleChat } = useChatStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, brandName);
    setInputText('');
  };

  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 z-40">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-action/80 backdrop-blur-md text-background flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:bg-action active:scale-95 transition-all"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="w-80 h-[500px] bg-black/20 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
          >
            {/* Header / Drag Handle */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-action animate-pulse" />
                <div>
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-action/80">Secure Feed</h3>
                  <p className="text-xs font-bold text-white">{brandName} VIP</p>
                </div>
              </div>
              <button 
                onClick={toggleChat} 
                className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
                onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking close
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
              onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when scrolling/interacting
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    <ShieldCheck className="text-action/40" size={32} />
                  </div>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                    Private encrypted session with {brandName} is active.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-action text-background rounded-tr-none shadow-[0_4px_15px_rgba(0,240,255,0.2)]' 
                        : 'bg-white/5 text-white rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="mt-1 text-[8px] font-black uppercase tracking-widest text-white/10 italic">
                      {msg.sender === 'user' ? 'You' : brandName.toUpperCase()}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div 
              className="p-4 bg-black/40 border-t border-white/10"
              onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when typing
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire with concierge..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-action/40 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="absolute right-1.5 p-2 bg-action text-background rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
