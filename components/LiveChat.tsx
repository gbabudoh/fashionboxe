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
    <div className="absolute right-10 bottom-40 z-40">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-action text-background flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-110 active:scale-95 transition-all"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 h-[500px] bg-black/40 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-action">Live Engagement</h3>
                <p className="text-xs font-bold text-white">{brandName} Concierge</p>
              </div>
              <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    <ShieldCheck className="text-action" size={32} />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    This is a secure private session with {brandName}. Messages are encrypted.
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
                    <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-action text-background rounded-tr-none' 
                        : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="mt-1 text-[8px] font-black uppercase tracking-widest text-white/20 italic">
                      {msg.sender === 'user' ? 'You' : brandName.toUpperCase()} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about materials, fit..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-action/40 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="absolute right-1.5 p-2 bg-action text-background rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
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
