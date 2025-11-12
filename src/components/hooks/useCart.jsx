// hooks/useCart.js
import { useState, useEffect } from 'react';
import { MINIMUM_DONATION, formatPrice } from '../utils/priceFormatting';
import { isCardAvailable, isCardDonated } from '../utils/cardsStateManager';

const CART_STORAGE_KEY = 'shoppingCart';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [voluntaryDonation, setVoluntaryDonation] = useState('0');

  // 🔥 Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // 🔥 FILTRAR cartas que ya fueron donadas
        // (por si el usuario cerró el navegador después del pago)
        const validCart = parsedCart.filter(item => isCardAvailable(item.id));
        
        if (validCart.length !== parsedCart.length) {
          console.log('⚠️ Se removieron cartas ya donadas del carrito');
        }
        
        setCart(validCart);
        
        // Guardar el carrito filtrado
        if (validCart.length > 0) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validCart));
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // 🔥 Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  const addToCart = (photo, amount) => {
    const price = parseFloat(amount) || 0;
    if (price < MINIMUM_DONATION) {
      alert(`La donación mínima por carta es de ${formatPrice(MINIMUM_DONATION)}`);
      return;
    }

    // 🔥 Verificar si la carta ya está donada
    if (isCardDonated(photo.id)) {
      alert('🎄 Esta carta ya ha sido donada. Por favor, elige otra.');
      return;
    }

    // 🔥 Verificar si la carta está disponible
    if (!isCardAvailable(photo.id)) {
      alert('⏳ Esta carta no está disponible en este momento.');
      return;
    }

    const existingIndex = cart.findIndex(item => item.id === photo.id);
    if (existingIndex !== -1) {
      // Actualizar precio si ya existe
      const newCart = [...cart];
      newCart[existingIndex] = { ...photo, price };
      setCart(newCart);
    } else {
      // Agregar nuevo item
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

  // 🔥 clearCart ahora SOLO limpia el estado, NO el localStorage
  // El localStorage se limpia SOLO cuando el pago es exitoso
  const clearCart = () => {
    setCart([]);
    setVoluntaryDonation('0');
  };

  // 🔥 Nueva función: limpiar carrito completamente (incluye localStorage)
  const clearCartCompletely = () => {
    setCart([]);
    setVoluntaryDonation('0');
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
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
    clearCartCompletely, // 🔥 Nueva función
  };
};