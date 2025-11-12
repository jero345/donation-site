// components/carousel/Carousel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselSection from './CarouselSection';
import CardModal from './CardModal';
import CartModal from './CartModal';
import { useCart } from '../hooks/useCart';
import { useCarousel } from '../hooks/useCarousel';
import { processImages } from '../utils/imageProcessing';
import { MINIMUM_DONATION } from '../utils/priceFormatting';
import { 
  isCardAvailable, 
  getStats, 
  resetAllCards,
  subscribeToCardsStateChanges,
  validateCartAvailability 
} from '../utils/cardsStateManager';
import bannerImage from '../../assets/logos/logo.png';

const images_5_6 = import.meta.glob('/src/assets/carts/5-6/*.webp', { eager: true });
const images_7_8 = import.meta.glob('/src/assets/carts/7-8/*.webp', { eager: true });
const images_9_10 = import.meta.glob('/src/assets/carts/9-10/*.webp', { eager: true });

const Carousel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 Para forzar re-render
  const navigate = useNavigate();

  const cartHook = useCart();
  const carouselHook = useCarousel();

  // 🔥 Suscribirse a cambios en el estado de las cartas
  useEffect(() => {
    console.log('📡 Suscribiéndose a cambios en cartas...');
    
    const unsubscribe = subscribeToCardsStateChanges((newState) => {
      console.log('🔄 Estado de cartas cambió:', newState);
      setRefreshKey(prev => prev + 1); // Forzar re-render
    });
    
    return () => {
      console.log('📡 Desuscribiéndose de cambios en cartas');
      unsubscribe();
    };
  }, []);

  // 🔥 Procesar TODAS las imágenes (SIEMPRE MOSTRAR TODAS)
  const photoGroups = {
    group1: processImages(images_5_6, 6),
    group2: processImages(images_7_8, 8),
    group3: processImages(images_9_10, 10),
  };

  console.log('📊 Estado del carrusel (refresh key:', refreshKey, '):', {
    total_group1: photoGroups.group1.length,
    total_group2: photoGroups.group2.length,
    total_group3: photoGroups.group3.length,
    donated_group1: photoGroups.group1.filter(p => !isCardAvailable(p.id)).length,
    donated_group2: photoGroups.group2.filter(p => !isCardAvailable(p.id)).length,
    donated_group3: photoGroups.group3.filter(p => !isCardAvailable(p.id)).length,
  });

  const totalPhotos = photoGroups.group1.length + photoGroups.group2.length + photoGroups.group3.length;

  const openModal = (photo) => {
    // 🔥 Verificar si la carta está disponible
    if (!isCardAvailable(photo.id)) {
      alert('🎄 Esta carta ya ha sido donada.\n\n¡Gracias por tu interés! Por favor elige otra carta disponible.');
      return;
    }
    
    setSelectedCard(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const proceedToCheckout = () => {
    if (cartHook.cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // 🔥 Verificar que todas las cartas del carrito sigan disponibles
    const cartCardIds = cartHook.cart.map(item => item.id);
    console.log('🔍 Validando carrito antes de checkout:', cartCardIds);
    
    const validation = validateCartAvailability(cartCardIds);
    
    if (!validation.isValid) {
      const unavailableNames = cartHook.cart
        .filter(item => validation.unavailableCards.includes(item.id))
        .map(item => item.name)
        .join(', ');
      
      alert(
        `⚠️ Algunas cartas ya no están disponibles:\n\n` +
        `${unavailableNames}\n\n` +
        `Serán removidas de tu carrito.`
      );
      
      // Remover cartas no disponibles del carrito
      validation.unavailableCards.forEach(cardId => {
        cartHook.removeFromCart(cardId);
      });
      
      // Si quedan cartas disponibles, continuar
      if (validation.availableCards.length === 0) {
        alert('❌ Tu carrito quedó vacío. Por favor selecciona otras cartas disponibles.');
        return;
      }
      
      alert(
        `✅ Continuarás con las cartas disponibles:\n\n` +
        `${cartHook.cart.filter(item => validation.availableCards.includes(item.id)).map(item => item.name).join(', ')}`
      );
    }
    
    console.log('✅ Todas las cartas del carrito están disponibles');
    
    const donationData = {
      cart: cartHook.cart,
      cardsTotal: cartHook.getTotalCardsPrice(),
      voluntaryDonation: cartHook.getVoluntaryAmount(),
      totalPrice: cartHook.getTotalPrice(),
      numberOfCards: cartHook.cart.length,
      cardIds: cartCardIds
    };
    
    console.log('📦 Datos de donación:', donationData);
    
    setShowCart(false);
    navigate('/donation', { state: donationData });
  };

  const handleResetAllCards = () => {
    const stats = getStats();
    const message = `⚠️ ¿Estás seguro de restaurar todas las cartas?\n\n` +
                   `📊 Estado actual:\n` +
                   `✅ Donadas: ${stats.donated}\n` +
                   `💚 Disponibles: ${stats.available}\n` +
                   `📦 Total: ${stats.total}\n\n` +
                   `Esta acción no se puede deshacer.`;
    
    if (window.confirm(message)) {
      const success = resetAllCards();
      if (success) {
        alert('✅ Todas las cartas han sido restauradas');
        window.location.reload();
      } else {
        alert('❌ Error al restaurar las cartas');
      }
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        setShowCart(false);
      }
    };
    if (isModalOpen || showCart) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, showCart]);

  const stats = getStats();

  return (
    <>
      <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
        <img
          src={bannerImage} alt="The Gift of Sharing"
          className="w-full h-auto max-h-[300px] object-contain mx-auto"
          style={{ 
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            borderRadius: '8px'
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
          >
            Porque los mejores regalos no son los que se empacan
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
          >
            Elige una carta y comparte con nosotros el regalo más grande: una Navidad vivida en comunidad.
          </p>
          
          {/* 🔥 Mostrar estadísticas globales */}
          <div className="mt-8 inline-block bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">📊 Estado de las cartas</p>
            <div className="flex gap-6 justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: '#92C83E' }}>{stats.available}</p>
                <p className="text-xs text-gray-500">Disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: '#ae311a' }}>{stats.donated}</p>
                <p className="text-xs text-gray-500">Donadas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>

        {cartHook.cart.length > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-2xl z-40 transition-all transform hover:scale-110 hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: '#92C83E' }}
          >
            <span className="text-2xl">🛒</span>
            <span 
              className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
            >
              {cartHook.cart.length}
            </span>
          </button>
        )}

        <CarouselSection
          key={`group1-${refreshKey}`}
          groupKey="group1"
          title="🎅 Niños y Niñas de 5-6 años 🎄"
          photos={photoGroups.group1}
          currentIndex={carouselHook.currentIndexes.group1}
          onPrevSlide={() => carouselHook.prevSlide('group1', photoGroups.group1.length)}
          onNextSlide={() => carouselHook.nextSlide('group1', photoGroups.group1.length)}
          onSetIndex={(index) => carouselHook.setCurrentIndexes(prev => ({ ...prev, group1: index }))}
          getVisiblePhotos={carouselHook.getVisiblePhotos}
          onOpenModal={openModal}
          isInCart={cartHook.isInCart}
          getCartItem={cartHook.getCartItem}
        />

        <CarouselSection
          key={`group2-${refreshKey}`}
          groupKey="group2"
          title="🎁 Niños y Niñas de 7-8 años ⭐"
          photos={photoGroups.group2}
          currentIndex={carouselHook.currentIndexes.group2}
          onPrevSlide={() => carouselHook.prevSlide('group2', photoGroups.group2.length)}
          onNextSlide={() => carouselHook.nextSlide('group2', photoGroups.group2.length)}
          onSetIndex={(index) => carouselHook.setCurrentIndexes(prev => ({ ...prev, group2: index }))}
          getVisiblePhotos={carouselHook.getVisiblePhotos}
          onOpenModal={openModal}
          isInCart={cartHook.isInCart}
          getCartItem={cartHook.getCartItem}
        />

        <CarouselSection
          key={`group3-${refreshKey}`}
          groupKey="group3"
          title="✨ Niños y Niñas de 9-10 años 🎄"
          photos={photoGroups.group3}
          currentIndex={carouselHook.currentIndexes.group3}
          onPrevSlide={() => carouselHook.prevSlide('group3', photoGroups.group3.length)}
          onNextSlide={() => carouselHook.nextSlide('group3', photoGroups.group3.length)}
          onSetIndex={(index) => carouselHook.setCurrentIndexes(prev => ({ ...prev, group3: index }))}
          getVisiblePhotos={carouselHook.getVisiblePhotos}
          onOpenModal={openModal}
          isInCart={cartHook.isInCart}
          getCartItem={cartHook.getCartItem}
        />

        {/* 🔥 Botón de reset para admin (solo visible si hay cartas donadas) */}
        {stats.donated > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleResetAllCards}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-lg"
            >
              🔄 Reiniciar todas las cartas (Solo Admin)
            </button>
          </div>
        )}
      </div>

      <CardModal
        selectedCard={selectedCard}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={cartHook.addToCart}
        isInCart={cartHook.isInCart}
        onRemoveFromCart={cartHook.removeFromCart}
        initialAmount={
          selectedCard && cartHook.isInCart(selectedCard.id)
            ? cartHook.getCartItem(selectedCard.id).price.toString()
            : MINIMUM_DONATION.toString()
        }
      />

      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cartHook.cart}
        onRemoveFromCart={cartHook.removeFromCart}
        getTotalCardsPrice={cartHook.getTotalCardsPrice}
        voluntaryDonation={cartHook.voluntaryDonation}
        setVoluntaryDonation={cartHook.setVoluntaryDonation}
        getVoluntaryAmount={cartHook.getVoluntaryAmount}
        getTotalPrice={cartHook.getTotalPrice}
        onProceedToCheckout={proceedToCheckout}
      />
    </>
  );
};

export default Carousel;