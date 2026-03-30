import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    type: 'product' | 'bundle';
}

interface CartStore {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + (existingItem.quantity || 1) } : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }] };
                });
            },
            removeFromCart: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                })),
            clearCart: () => set({ items: [] }),
            total: () => {
                const items = get().items || [];
                return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
            },
        }),
        {
            name: 'envorent-cart-storage', // unique name
        }
    )
);
