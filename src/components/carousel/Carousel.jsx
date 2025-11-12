// components/carousel/Carousel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselSection from './CarouselSection';
import CardModal from './CardModal';
import CartModal from './CartModal';
import { useCart } from '../hooks/useCart';
import { useCarousel } from '../hooks/useCarousel';
import { MINIMUM_DONATION } from '../utils/priceFormatting';
import { 
  getStats, 
  resetAllCards,
  subscribeToCardsStateChanges,
  validateCartAvailability,
} from '../utils/cardsStateManager';
import { cardsService } from '../services/cardService';
import bannerImage from '../../assets/logos/logo.png';

const Carousel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [photoGroups, setPhotoGroups] = useState({
    group1: [],
    group2: [],
    group3: [],
  });
  const navigate = useNavigate();

  const cartHook = useCart();
  const carouselHook = useCarousel();

  // 🔥 CARGAR CARTAS DESDE EL BACKEND
  useEffect(() => {
    console.log('🔄 Cargando cartas desde el backend...');
    
    const loadCardsFromBackend = async () => {
      try {
        setIsLoading(true);
        
        // Obtener todas las cartas del backend
        const result = await cardsService.getAllCards();
        
        if (!result.success) {
          throw new Error('No se pudieron cargar las cartas');
        }
        
        console.log('📦 Cartas del backend:', result.cards);
        
        // Agrupar por categoría
        const groups = {
          group1: [], // 5-6 años
          group2: [], // 7-8 años
          group3: [], // 9-10 años
        };
        
        result.cards.forEach(card => {
          // Determinar el grupo según la categoría
          let groupKey = null;
          
          if (card.ref.startsWith('5-6-') || card.ref.startsWith('6-5-')) {
            groupKey = 'group1';
          } else if (card.ref.startsWith('7-8-') || card.ref.startsWith('8-7-')) {
            groupKey = 'group2';
          } else if (card.ref.startsWith('9-10-') || card.ref.startsWith('10-9-')) {
            groupKey = 'group3';
          }
          
          if (groupKey) {
            groups[groupKey].push({
              id: card.id, // ✅ UUID del backend
              ref: card.ref, // ✅ Ref del backend
              name: card.name, // ✅ Nombre del backend
              src: card.url, // ✅ URL de la imagen
              alt: card.name,
              donated: card.donated, // ✅ Estado de donación
              category: card.ref.split('-').slice(0, 2).join('-'), // "5-6", "7-8", etc.
            });
          }
        });
        
        // Ordenar alfabéticamente
        Object.keys(groups).forEach(key => {
          groups[key].sort((a, b) => a.name.localeCompare(b.name));
        });
        
        console.log('📊 Cartas agrupadas:');
        console.log('   Grupo 5-6:', groups.group1.length);
        console.log('   Grupo 7-8:', groups.group2.length);
        console.log('   Grupo 9-10:', groups.group3.length);
        
        setPhotoGroups(groups);
        setIsLoading(false);
        
      } catch (error) {
        console.error('❌ Error cargando cartas:', error);
        setIsLoading(false);
      }
    };
    
    loadCardsFromBackend();
  }, [refreshKey]);

  // Suscribirse a cambios
  useEffect(() => {
    const unsubscribe = subscribeToCardsStateChanges(() => {
      setRefreshKey(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, []);

  const openModal = (photo) => {
    // 🔥 Verificar si la carta está donada (según el backend)
    if (photo.donated) {
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
    
    const cartCardIds = cartHook.cart.map(item => item.id);
    
    const donationData = {
      cart: cartHook.cart,
      cardsTotal: cartHook.getTotalCardsPrice(),
      voluntaryDonation: cartHook.getVoluntaryAmount(),
      totalPrice: cartHook.getTotalPrice(),
      numberOfCards: cartHook.cart.length,
      cardIds: cartCardIds
    };
    
    setShowCart(false);
    navigate('/donation', { state: donationData });
  };

  const handleResetAllCards = async () => {
    const stats = await getStats();
    const message = `⚠️ ¿Estás seguro de restaurar todas las cartas?\n\n` +
                   `📊 Estado actual:\n` +
                   `✅ Donadas: ${stats.donated}\n` +
                   `💚 Disponibles: ${stats.available}\n` +
                   `📦 Total: ${stats.total}\n\n` +
                   `Esta acción no se puede deshacer.`;
    
    if (window.confirm(message)) {
      const success = await resetAllCards();
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

  const [stats, setStats] = useState({ donated: 0, available: 0, total: 97 });
  
  useEffect(() => {
    const loadStats = async () => {
      const newStats = await getStats();
      setStats(newStats);
    };
    loadStats();
    
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold" style={{ color: '#30793b' }}>
            Cargando cartas...
          </p>
        </div>
      </div>
    );
  }

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