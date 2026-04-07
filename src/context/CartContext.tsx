import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '@/lib/supabase';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && 
                item.selectedColor === selectedColor && 
                item.selectedSize === selectedSize
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { product, quantity, selectedColor, selectedSize }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
