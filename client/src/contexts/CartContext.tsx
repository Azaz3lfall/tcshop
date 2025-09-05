// client/src/contexts/CartContext.tsx

'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// --- NOVIDADE 1: O tipo do item no carrinho mudou ---
// Ele agora precisa de informações da variante e um ID único para a combinação.
export type CartItem = {
  id: number; // Id do produto principal
  name: string;
  price: string;
  quantity: number;
  color: string; // Informação da variante
  imageUrl: string; // Imagem da variante
  variantId: string; // ID único para a combinação (ex: "1-Preto")
};

// Tipos para nos ajudar
type ProductForCart = {
    id: number;
    name: string;
    price: string;
};
type VariantForCart = {
    color: string;
    imageUrl: string;
    stock: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: ProductForCart, variant: VariantForCart) => void;
  removeFromCart: (variantId: string) => void; // Agora usa o variantId
  updateItemQuantity: (variantId: string, newQuantity: number) => void; // Agora usa o variantId
  clearCart: () => void;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Carregar do localStorage (continua igual)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  // Salvar no localStorage (continua igual)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- NOVIDADE 2: Lógica do addToCart foi atualizada ---
  const addToCart = (product: ProductForCart, variant: VariantForCart) => {
    const variantId = `${product.id}-${variant.color}`; // Cria um ID único, ex: "2-RGB"
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.variantId === variantId);

      if (existingItem) {
        // Se a mesma cor do mesmo produto já existe, só incrementa a quantidade
        return prevItems.map(item =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se for um novo item (ou uma nova cor do mesmo produto), adiciona à lista
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          color: variant.color,
          imageUrl: variant.imageUrl,
          variantId: variantId,
        };
        return [...prevItems, newItem];
      }
    });
  };
  
  // --- NOVIDADE 3: Funções de remover/atualizar agora usam variantId ---
  const removeFromCart = (variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
  };

  const updateItemQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.variantId === variantId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);

  const value = {
    cartItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};