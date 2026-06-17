import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Adiciona o produto direto (sem variantes) validando o stock síncrono do PocketBase
  const addToCart = useCallback((product, _, quantity = 1, availableStock) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;

      if (currentQuantity + quantity > availableStock) {
        // Lógica de segurança para não ultrapassar o stock do PocketBase
        return prevItems;
      }

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Guarda o produto diretamente com a quantidade inicial e o stock máximo disponível
      return [...prevItems, { ...product, quantity, availableQuantity: availableStock }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calcula o total diretamente multiplicando o preço float/decimal pela quantidade
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};