import { useState } from 'react';
import { MINIMUM_DONATION, formatPrice } from '../utils/priceFormatting';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [voluntaryDonation, setVoluntaryDonation] = useState('0');

  const addToCart = (photo, amount) => {
    const price = parseFloat(amount) || 0;
    if (price < MINIMUM_DONATION) {
      alert(`La donación mínima por carta es de ${formatPrice(MINIMUM_DONATION)}`);
      return;
    }

    const existingIndex = cart.findIndex(item => item.id === photo.id);
    if (existingIndex !== -1) {
      const newCart = [...cart];
      newCart[existingIndex] = { ...photo, price };
      setCart(newCart);
    } else {
      setCart([...cart, { ...photo, price }]);
    }
  };

  const removeFromCart = (photoId) => {
    setCart(cart.filter(item => item.id !== photoId));
  };

  const isInCart = (photoId) => {
    return cart.some(item => item.id === photoId);
  };

  const getCartItem = (photoId) => {
    return cart.find(item => item.id === photoId);
  };

  const getTotalCardsPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getVoluntaryAmount = () => {
    return parseFloat(voluntaryDonation) || 0;
  };

  const getTotalPrice = () => {
    return getTotalCardsPrice() + getVoluntaryAmount();
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    setCart,
    voluntaryDonation,
    setVoluntaryDonation,
    addToCart,
    removeFromCart,
    isInCart,
    getCartItem,
    getTotalCardsPrice,
    getVoluntaryAmount,
    getTotalPrice,
    clearCart,
  };
};