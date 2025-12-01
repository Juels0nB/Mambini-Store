import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, amount: number) => void;
    clearCart: () => void;
    total: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    // 1. INICIALIZAÇÃO CORRETA: Lê do storage antes de renderizar
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Tenta ler do localStorage IMEDIATAMENTE ao iniciar
        const storedCart = localStorage.getItem("shoppingCart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // 2. Salvar no LocalStorage sempre que o carrinho mudar
    useEffect(() => {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === newItem.id && item.size === newItem.size
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === newItem.id && item.size === newItem.size
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            } else {
                return [...prevCart, newItem];
            }
        });
    };

    const removeFromCart = (id: string, size: string) => {
        setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id: string, size: string, amount: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id && item.size === size) {
                    const newQty = item.quantity + amount;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};