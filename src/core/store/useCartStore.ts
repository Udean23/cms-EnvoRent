import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    type: 'product' | 'bundle';
    cartId?: string;
}

interface CartStore {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity' | 'cartId'>) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                set((state) => {
                    const cartId = `${item.type}-${item.id}`;
                    const existingItem = state.items.find((i) => i.cartId === cartId);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...item, cartId, quantity: 1 }] };
                });
            },
            removeFromCart: (cartId) =>
                set((state) => ({ items: state.items.filter((i) => i.cartId !== cartId) })),
            updateQuantity: (cartId, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i
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
