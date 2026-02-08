import { create } from 'zustand';

interface LiveState {
  isShopperActive: boolean;
  jitsiRoomId: string | null;
  brandName: string | null;
  setShopperActive: (active: boolean, roomId?: string, brandName?: string) => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  isShopperActive: false,
  jitsiRoomId: null,
  brandName: null,
  setShopperActive: (active, roomId, brandName) => 
    set({ 
      isShopperActive: active, 
      jitsiRoomId: active ? roomId : null,
      brandName: active ? brandName : null
    }),
}));
