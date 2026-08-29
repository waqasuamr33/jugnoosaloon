"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ProductItem } from "../lib/api";

export interface CartItem {
  product: ProductItem;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotalAmount: number;
  generateWhatsAppOrderUrl: (customerName?: string, notes?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "jugnu_saloon_cart_v1";
const OFFICIAL_WHATSAPP_NUMBER = "923194415757";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync cart changes to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const getEffectivePrice = (product: ProductItem): number => {
    if (
      product.discount &&
      product.discount > 0 &&
      product.discounted_price &&
      product.discounted_price < product.price
    ) {
      return product.discounted_price;
    }
    return product.price;
  };

  const addToCart = (product: ProductItem, quantity: number = 1) => {
    const effectivePrice = getEffectivePrice(product);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty > 0 ? newQty : 1,
          unitPrice: effectivePrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: Math.max(1, quantity),
            unitPrice: effectivePrice,
          },
        ];
      }
    });

    // Automatically reveal cart drawer on adding
    setIsOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const generateWhatsAppOrderUrl = (
    customerName: string = "",
    notes: string = ""
  ): string => {
    if (cart.length === 0) {
      return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello Jugnu's Saloon, I would like to inquire about your store products."
      )}`;
    }

    const lines: string[] = [];
    lines.push(`✨ *JUGNU'S SALOON - PRODUCT ORDER INQUIRY* ✨\n`);
    
    if (customerName.trim()) {
      lines.push(`👤 *Customer:* ${customerName.trim()}`);
    }

    lines.push(`📦 *Order Summary (${totalItemsCount} item${totalItemsCount > 1 ? "s" : ""}):*`);
    
    cart.forEach((item, idx) => {
      const itemTotal = item.unitPrice * item.quantity;
      lines.push(
        `${idx + 1}. *${item.product.title}*\n   Qty: ${item.quantity} × Rs. ${item.unitPrice.toLocaleString()} = *Rs. ${itemTotal.toLocaleString()}*`
      );
    });

    lines.push(`\n💰 *Grand Total: Rs. ${subtotalAmount.toLocaleString()}*`);

    if (notes.trim()) {
      lines.push(`\n📝 *Notes / Delivery Address:*\n${notes.trim()}`);
    }

    lines.push(
      `\n🔗 *Catalog:* https://software.jugnussaloon.com/products\n\nPlease confirm availability and payment/delivery details.`
    );

    const message = lines.join("\n");
    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotalAmount,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
