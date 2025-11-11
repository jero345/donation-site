import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselSection from './CarouselSection';
import CardModal from './CardModal';
import CartModal from './CartModal';
import { useCart } from '../hooks/useCart';
import { useCarousel } from '../hooks/useCarousel';
import { processImages, filterAvailableCards } from '../utils/imageProcessing';
import { MINIMUM_DONATION } from '../utils/priceFormatting';
import bannerImage from '/src/assets/logo.png';

// Importar imágenes
const images_5_6 = import.meta.glob('/src/assets/carts/5-6/*.jpg', { eager: true });
const images_7_8 = import.meta.glob('/src/assets/carts/7-8/*.jpg', { eager: true });
const images_9_10 = import.meta.glob('/src/assets/carts/9-10/*.jpg', { eager: true });

const Carousel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [donatedCards, setDonatedCards] = useState([]);
  const navigate = useNavigate();

  // Custom hooks
  const cartHook = useCart();
  const carouselHook = useCarousel();

  // Procesar imágenes
  const allPhotoGroups = {
    group1: processImages(images_5_6, 6),
    group2: processImages(images_7_8, 8),
    group3: processImages(images_9_10, 10),
  };

  // Cartas disponibles (no donadas)
  const photoGroups = {
    group1: filterAvailableCards(allPhotoGroups.group1, donatedCards),
    group2: filterAvailableCards(allPhotoGroups.group2, donatedCards),
    group3: filterAvailableCards(allPhotoGroups.group3, donatedCards),
  };

  const totalPhotos = photoGroups.group1.length + photoGroups.group2.length + photoGroups.group3.length;

  // Funciones de modal
  const openModal = (photo) => {
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
    
    const cartCardIds = cartHook.cart.map(item => item.id);
    setDonatedCards([...donatedCards, ...cartCardIds]);
    
    const donationData = {
      cart: cartHook.cart,
      cardsTotal: cartHook.getTotalCardsPrice(),
      voluntaryDonation: cartHook.getVoluntaryAmount(),
      totalPrice: cartHook.getTotalPrice(),
      numberOfCards: cartHook.cart.length
    };
    
    cartHook.clearCart();
    setShowCart(false);
    navigate('/donation', { state: donationData });
  };

  const handleResetDonatedCards = () => {
    setDonatedCards([]);
    carouselHook.setCurrentIndexes({ group1: 0, group2: 0, group3: 0 });
    alert('✅ Todas las cartas han sido restauradas');
  };

  // Manejo de tecla Escape
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

  // Si no hay cartas disponibles
  if (totalPhotos === 0) {
    return (
      <div className="text-center p-8" style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}>
        <p className="text-2xl mb-4">🎄 ¡Todas las cartas han sido donadas! 🎄</p>
        <p className="text-lg mb-6">Gracias por tu generosidad esta Navidad</p>
        <button
          onClick={handleResetDonatedCards}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
        >
          🔄 Reiniciar cartas
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Banner */}
      <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
        <img
          src={bannerImage}
          alt="The Gift of Sharing"
          className="w-full h-auto max-h-[300px] object-contain mx-auto"
        style={{ 
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            borderRadius: '8px'
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <div className="text-center mb-16">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ 
              color: '#ae311a', 
              fontFamily: 'Poppins, sans-serif' 
            }}
          >
            Porque los mejores regalos no son los que se empacan
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ 
              color: '#30793b', 
              fontFamily: 'Roboto, sans-serif' 
            }}
          >
            Elige una carta y comparte con nosotros el regalo más grande: una Navidad vivida en comunidad.
          </p>
        </div>

        {/* Botón de reset para desarrollo */}
        {donatedCards.length > 0 && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={handleResetDonatedCards}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-medium flex items-center gap-2"
              title="Reiniciar cartas donadas (solo desarrollo)"
            >
              🔄 Reset ({donatedCards.length})
            </button>
          </div>
        )}

        {/* Botón del carrito flotante */}
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

        {/* Carruseles */}
        <CarouselSection
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
      </div>

      {/* Modal de carta individual */}
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

      {/* Modal del carrito */}
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