import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'brand';
  text: string;
  timestamp: Date;
  brandName?: string;
}

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  lastEngagement: Date | null;
  toggleChat: () => void;
  sendMessage: (text: string, brandName: string) => void;
  receiveMessage: (text: string, brandName: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: [],
  lastEngagement: null,
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  sendMessage: (text, brandName) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    
    set((state) => ({ 
      messages: [...state.messages, newMessage],
      lastEngagement: new Date()
    }));
    
    // 2026 UX: Auto-response simulation for the demo
    setTimeout(() => {
      get().receiveMessage(`Thank you for reaching out to ${brandName}. A representative will be with you shortly.`, brandName);
    }, 1500);
  },
  
  receiveMessage: (text, brandName) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'brand',
      text,
      timestamp: new Date(),
      brandName
    };
    
    set((state) => ({ 
      messages: [...state.messages, newMessage],
      lastEngagement: new Date()
    }));
  },
  
  clearMessages: () => set({ messages: [] }),
}));
