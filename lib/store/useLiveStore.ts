import { create } from 'zustand';

interface LiveState {
  isShopperActive: boolean;
  livekitRoomId: string | null;
  brandName: string | null;
  setShopperActive: (active: boolean, roomId?: string, brandName?: string) => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  isShopperActive: false,
  livekitRoomId: null,
  brandName: null,
  setShopperActive: (active, roomId, brandName) => 
    set({ 
      isShopperActive: active, 
      livekitRoomId: active ? roomId : null,
      brandName: active ? brandName : null
    }),
}));
