import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar imágenes por carpeta de edad
const images_5_6 = import.meta.glob('/src/assets/carts/5-6/*.jpg', { eager: true });
const images_7_8 = import.meta.glob('/src/assets/carts/7-8/*.jpg', { eager: true });
const images_9_10 = import.meta.glob('/src/assets/carts/9-10/*.jpg', { eager: true });

const Carousel = () => {
  const [currentIndexes, setCurrentIndexes] = useState({ group1: 0, group2: 0, group3: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [donationAmount, setDonationAmount] = useState('90000');
  const [voluntaryDonation, setVoluntaryDonation] = useState('0');
  const navigate = useNavigate();

  const MINIMUM_DONATION = 90000; // Donación mínima por carta

  // ============= FUNCIONES DE PROCESAMIENTO DE IMÁGENES =============
  const getNameFromPath = (path) => {
    const fileName = path.split('/').pop();
    return fileName.replace('.jpg', '').replace('.JPG', '');
  };

  const processImages = (imageModules, age) => {
    return Object.keys(imageModules)
      .filter(path => /\.(jpg|JPG)$/i.test(path))
      .map((path, index) => {
        const name = getNameFromPath(path);
        return {
          id: `${age}-${name}`,
          src: imageModules[path].default,
          alt: name,
          name: name,
          age: age,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const photoGroups = {
    group1: processImages(images_5_6, 6),
    group2: processImages(images_7_8, 8),
    group3: processImages(images_9_10, 10),
  };

  const totalPhotos = photoGroups.group1.length + photoGroups.group2.length + photoGroups.group3.length;

  // ============= FUNCIONES DEL CARRITO =============
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setDonationAmount(value);
  };

  const handleVoluntaryDonationChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setVoluntaryDonation(value);
  };

  // ============= FUNCIONES DEL CARRUSEL =============
  const nextSlide = (groupKey) => {
    const photos = photoGroups[groupKey];
    if (photos.length === 0) return;
    setCurrentIndexes(prev => ({
      ...prev,
      [groupKey]: (prev[groupKey] + 1) % photos.length
    }));
  };

  const prevSlide = (groupKey) => {
    const photos = photoGroups[groupKey];
    if (photos.length === 0) return;
    setCurrentIndexes(prev => ({
      ...prev,
      [groupKey]: (prev[groupKey] - 1 + photos.length) % photos.length
    }));
  };

  const getVisiblePhotos = (groupKey) => {
    const photos = photoGroups[groupKey];
    if (photos.length === 0) return [];
    
    const currentIndex = currentIndexes[groupKey];
    const visible = [];
    const displayCount = Math.min(3, photos.length);
    
    for (let i = 0; i < displayCount; i++) {
      visible.push(photos[(currentIndex + i) % photos.length]);
    }
    return visible;
  };

  // ============= FUNCIONES DE MODAL =============
  const openModal = (photo) => {
    setSelectedCard(photo);
    const cartItem = getCartItem(photo.id);
    if (cartItem) {
      setDonationAmount(cartItem.price.toString());
    } else {
      setDonationAmount(MINIMUM_DONATION.toString());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setDonationAmount(MINIMUM_DONATION.toString());
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
      setShowCart(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedCard, donationAmount);
    closeModal();
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // Preparar datos para enviar al formulario de donación
    const donationData = {
      cart: cart,
      cardsTotal: getTotalCardsPrice(),
      voluntaryDonation: getVoluntaryAmount(),
      totalPrice: getTotalPrice(),
      numberOfCards: cart.length
    };
    
    setShowCart(false);
    navigate('/donation', { state: donationData });
  };

  // ============= EFFECTS =============
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

  // ============= VALIDACIÓN DE IMÁGENES =============
  if (totalPhotos === 0) {
    return (
      <div className="text-center p-8 text-red-600">
        ❌ No se encontraron imágenes en ./assets/carts/
        <br />
        <span className="text-sm">Verifica que existan las carpetas: 5-6/, 7-8/, 9-10/</span>
      </div>
    );
  }

  // ============= COMPONENTE DE CARRUSEL =============
  const CarouselSection = ({ groupKey, title, subtitle, photos }) => {
    if (photos.length === 0) return null;

    return (
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D2483F] mb-2 flex items-center justify-center gap-2 sm:gap-3">
            {title}
          </h2>
          <p className="text-[#1E6B3E] text-sm sm:text-base md:text-lg font-medium">
            {subtitle}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => prevSlide(groupKey)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#D2483F] hover:bg-[#B24A3D] text-white p-2 sm:p-3 rounded-full shadow-md z-10 transition-all transform hover:scale-110"
          >
            <span className="text-lg sm:text-xl">❮</span>
          </button>

          <div className="flex gap-3 sm:gap-6 justify-center overflow-x-auto pb-4 pt-4 sm:pt-6">
            {getVisiblePhotos(groupKey).map((photo, index) => (
              <div
                key={`${photo.name}-${index}`}
                onClick={() => openModal(photo)}
                className={`cursor-pointer transition-all duration-500 transform ${
                  index === 1 ? 'scale-105 sm:scale-110 z-10' : 'scale-90 opacity-75'
                } relative`}
              >
                {isInCart(photo.id) && (
                  <div className="absolute -top-2 -right-2 bg-[#9EDB58] text-white rounded-full w-8 h-8 flex items-center justify-center z-20 shadow-lg">
                    ✓
                  </div>
                )}
                
                <div className={`bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border-2 sm:border-4 ${
                  isInCart(photo.id) ? 'border-[#9EDB58]' : 'border-[#F3ECE6]'
                } hover:border-[#F39C2B] transition-all`}>
                  <div className="relative">
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#D2483F] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-base font-bold z-10 shadow-md">
                      🎁 {photo.age} años
                    </div>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-40 sm:w-80 h-56 sm:h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2F2F2F]/90 to-transparent p-3 sm:p-6">
                      <h3 className="text-white font-bold text-lg sm:text-2xl mb-1">{photo.name}</h3>
                      {isInCart(photo.id) && (
                        <p className="text-[#9EDB58] text-sm sm:text-lg font-bold">
                          {formatPrice(getCartItem(photo.id).price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => nextSlide(groupKey)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#D2483F] hover:bg-[#B24A3D] text-white p-2 sm:p-3 rounded-full shadow-md z-10 transition-all transform hover:scale-110"
          >
            <span className="text-lg sm:text-xl">❯</span>
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndexes(prev => ({ ...prev, [groupKey]: index }))}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndexes[groupKey] ? 'bg-[#D2483F] w-6 sm:w-8' : 'bg-[#F3ECE6]'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // ============= RENDER PRINCIPAL =============
  return (
    <>
      <div className="relative max-w-6xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        {/* Botón del carrito flotante */}
        {cart.length > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 bg-[#9EDB58] hover:bg-[#8BC34A] text-white p-4 rounded-full shadow-2xl z-40 transition-all transform hover:scale-110 flex items-center gap-2"
          >
            <span className="text-2xl">🛒</span>
            <span className="bg-[#D2483F] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {cart.length}
            </span>
          </button>
        )}

        {/* Carruseles */}
        <CarouselSection
          groupKey="group1"
          title="🎅 Niños de 5-6 años 🎄"
          subtitle="Los más pequeñitos esperan tu ayuda"
          photos={photoGroups.group1}
        />

        <CarouselSection
          groupKey="group2"
          title="🎁 Niños de 7-8 años ⭐"
          subtitle="Llenos de ilusión por la Navidad"
          photos={photoGroups.group2}
        />

        <CarouselSection
          groupKey="group3"
          title="✨ Niños de 9-10 años 🎄"
          subtitle="Esperando hacer realidad sus sueños"
          photos={photoGroups.group3}
        />
      </div>

      {/* ============= MODAL DE CARTA INDIVIDUAL ============= */}
      {isModalOpen && selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl z-10 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
            >
              ×
            </button>

            <div className="p-4 sm:p-6 pt-10 sm:pt-12">
              <div className="flex flex-col items-center">
                {/* Imagen */}
                <img
                  src={selectedCard.src}
                  alt={selectedCard.alt}
                  className="w-full max-w-[90%] sm:max-w-[80%] h-auto rounded-xl sm:rounded-2xl shadow-lg mb-6"
                />
                
                {/* Información */}
                <div className="text-center mb-6 w-full">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#D2483F] mb-2">
                    {selectedCard.name}
                  </h3>
                  <p className="text-lg text-[#1E6B3E] font-medium mb-4">
                    {selectedCard.age} años
                  </p>

                  {/* Input de donación */}
                  <div className="max-w-md mx-auto mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Cuánto deseas donar? (Mínimo {formatPrice(MINIMUM_DONATION)})
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">
                        $
                      </span>
                      <input
                        type="text"
                        value={donationAmount}
                        onChange={handleAmountChange}
                        placeholder={MINIMUM_DONATION.toString()}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:border-[#9EDB58] transition-all"
                      />
                    </div>
                    {donationAmount && (
                      <p className="text-sm text-gray-600 mt-2">
                        Donación: {formatPrice(parseFloat(donationAmount) || 0)}
                      </p>
                    )}
                  </div>

                  {/* Montos sugeridos */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {[90000, 100000, 150000, 200000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount.toString())}
                        className="px-4 py-2 bg-gray-100 hover:bg-[#9EDB58] hover:text-white rounded-full text-sm font-medium transition-all"
                      >
                        {formatPrice(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 w-full max-w-md">
                  {isInCart(selectedCard.id) ? (
                    <>
                      <button
                        onClick={() => removeFromCart(selectedCard.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full font-medium transition-all shadow-md"
                      >
                        🗑️ Quitar
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-[#F39C2B] hover:bg-[#E08A1A] text-white px-4 py-3 rounded-full font-medium transition-all shadow-md"
                      >
                        💾 Actualizar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#9EDB58] hover:bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium text-lg transition-all shadow-md"
                    >
                      ➕ Agregar al carrito
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL DEL CARRITO ============= */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl z-10 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
            >
              ×
            </button>

            <div className="p-4 sm:p-6 pt-10 sm:pt-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#D2483F] mb-6 text-center">
                🛒 Tu Carrito de Donaciones
              </h2>

              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No has agregado ninguna carta aún</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-[#D2483F] text-lg">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.age} años</p>
                          <p className="font-bold text-[#F39C2B] text-lg">{formatPrice(item.price)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-2xl transition-all hover:scale-110"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal de cartas */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center text-lg font-semibold mb-2">
                      <span className="text-gray-700">Subtotal cartas:</span>
                      <span className="text-[#1E6B3E]">{formatPrice(getTotalCardsPrice())}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      {cart.length} {cart.length === 1 ? 'carta' : 'cartas'} en tu carrito
                    </p>
                  </div>

                  {/* Donación voluntaria adicional */}
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mb-6">
                    <label className="block text-sm font-bold text-blue-900 mb-3 text-center">
                      💝 Donación voluntaria adicional para el evento
                    </label>
                    <div className="relative max-w-md mx-auto">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-lg">
                        $
                      </span>
                      <input
                        type="text"
                        value={voluntaryDonation}
                        onChange={handleVoluntaryDonationChange}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-3 border-2 border-blue-300 rounded-lg text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    {getVoluntaryAmount() > 0 && (
                      <p className="text-sm text-blue-700 mt-2 text-center font-medium">
                        Aporte adicional: {formatPrice(getVoluntaryAmount())}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2 text-center italic">
                      Tu aporte adicional ayuda a hacer posible este evento
                    </p>
                  </div>

                  {/* Total final */}
                  <div className="border-t-2 border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center text-2xl sm:text-3xl font-bold">
                      <span className="text-[#1E6B3E]">Total:</span>
                      <span className="text-[#F39C2B]">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-[#0B5BA8] hover:bg-[#094A7A] text-white px-6 py-4 rounded-full font-medium text-lg transition-all shadow-md transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>💳</span>
                    <span>Proceder al Pago</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;