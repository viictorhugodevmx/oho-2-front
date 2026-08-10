"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartService } from "@/services";
import type { Cart, ProductConfiguration } from "@/types";

const EMPTY_CART: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  total: 0,
};

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  isLoading: boolean;
  addItem: (configuration: ProductConfiguration) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCart(cartService.getCart());
      setIsLoading(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const addItem = useCallback((configuration: ProductConfiguration) => {
    setCart(cartService.addItem(configuration));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart(cartService.updateQuantity(itemId, quantity));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCart(cartService.removeItem(itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart(cartService.clear());
  }, []);

  const itemCount = useMemo(
    () =>
      cart.items.reduce(
        (totalQuantity, item) => totalQuantity + item.quantity,
        0,
      ),
    [cart.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount,
      isLoading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      addItem,
      cart,
      clearCart,
      isLoading,
      itemCount,
      removeItem,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider.");
  }

  return context;
}
