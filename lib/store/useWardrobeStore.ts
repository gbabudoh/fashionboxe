import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WardrobeItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  designer?: string;
  brand?: string;
  brandId?: string;
  category?: string;
  quantity: number;
}

interface WardrobeStore {
  items: WardrobeItem[];
  addItem: (item: Omit<WardrobeItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearWardrobe: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useWardrobeStore = create<WardrobeStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...newItem, quantity: 1 }],
          });
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      
      clearWardrobe: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = typeof item.price === 'string' 
            ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
            : item.price;
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'fashionboxe-wardrobe',
    }
  )
);
