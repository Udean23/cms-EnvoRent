import { create } from 'zustand';

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

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    addToCart: (item) => {
        set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
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
    total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
