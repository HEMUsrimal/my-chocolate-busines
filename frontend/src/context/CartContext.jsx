import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
    }
    return [];
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Save cart to localStorage and calculate totals whenever it changes
  useEffect(() => {
    const safeCart = Array.isArray(cart) ? cart : [];
    localStorage.setItem('cart', JSON.stringify(safeCart));
    const items = safeCart.reduce((total, item) => total + item.quantity, 0);
    const price = safeCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalItems(items);
    setTotalPrice(price);
  }, [cart]);

  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    const qtyToAdd = product.quantity !== undefined ? product.quantity : 1;
    
    setCart(prevCart => {
      const safeCart = Array.isArray(prevCart) ? prevCart : [];
      const existingItem = safeCart.find(item => item._id === product._id);
      
      if (existingItem) {
        const newCart = safeCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
        console.log('Updated existing item in cart:', newCart);
        return newCart;
      }
      
      const newCart = [...safeCart, { ...product, quantity: qtyToAdd }];
      console.log('Added new item to cart:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    console.log('Removing from cart:', productId);
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    console.log('Updating quantity:', productId, quantity);
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 