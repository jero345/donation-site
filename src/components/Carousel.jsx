import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar a /donation

// Importamos todas las imágenes dinámicamente con Vite
const imageModules = import.meta.glob('/src/assets/carts/*.jpg', { eager: true });

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [selectedCard, setSelectedCard] = useState(null); // Foto seleccionada para el modal
  const navigate = useNavigate(); // Hook para navegar

  // Construimos el array de fotos con validación
  const photos = Object.keys(imageModules)
    .filter(path => /\.jpg$/i.test(path)) // Solo archivos .jpg
    .map((path) => {
      // Extraer el número del nombre del archivo (ej: "1.jpg" → 1)
      const match = path.match(/\/(\d+)\.jpg$/i);
      if (!match) return null; // Ignorar si no tiene número

      const id = parseInt(match[1]);
      return {
        id,
        src: imageModules[path].default,
        alt: `Niño ${id}`,
        name: `Nombre ${id}`,
        age: Math.floor(Math.random() * 5) + 5, // Edad entre 5 y 9
      };
    })
    .filter(Boolean) // Eliminar nulls
    .sort((a, b) => a.id - b.id); // Ordenar por ID

  // Si no hay fotos, mostrar mensaje de error o fallback
  if (photos.length === 0) {
    return (
      <div className="text-center p-8 text-red-600">
        ❌ No se encontraron imágenes en ./assets/carts/. Por favor, verifica que existan los archivos 1.jpg, 2.jpg, ..., 45.jpg.
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  const getVisiblePhotos = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(photos[(currentIndex + i) % photos.length]);
    }
    return visible;
  };

  // Función para abrir el modal
  const openModal = (photo) => {
    setSelectedCard(photo);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  // Cerrar al hacer clic fuera del contenido del modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Función para abrir el formulario de donación
  const openDonationForm = () => {
    closeModal(); // Cierra el modal antes de navegar
    navigate('/donation', { state: { selectedCard } }); // Pasa la carta seleccionada
  };

  return (
    <>
      {/* Carrusel */}
      <div className="relative max-w-6xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D2483F] mb-2 flex items-center justify-center gap-2 sm:gap-3">
            🎅 Ayuda a un Niño esta Navidad 🎄
          </h2>
          <p className="text-[#1E6B3E] text-sm sm:text-base md:text-lg font-medium">
            Haz que su Navidad sea especial con tu donación
          </p>
        </div>

        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#D2483F] hover:bg-[#B24A3D] text-white p-2 sm:p-3 rounded-full shadow-md z-10 transition-all transform hover:scale-110"
          >
            <span className="text-lg sm:text-xl">❮</span>
          </button>

          <div className="flex gap-3 sm:gap-6 justify-center overflow-x-auto pb-4 pt-4 sm:pt-6">
            {getVisiblePhotos().map((photo, index) => (
              <div
                key={`${photo.id}-${index}`}
                onClick={() => openModal(photo)}
                className={`cursor-pointer transition-all duration-500 transform ${
                  index === 1 ? 'scale-105 sm:scale-110 z-10' : 'scale-90 opacity-75'
                }`}
              >
                <div className={`bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border-2 sm:border-4 ${
                  false // selectedPhoto?.id === photo.id
                    ? 'border-[#F39C2B]'
                    : 'border-[#F3ECE6]'
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
                      <p className="text-[#9EDB58] text-xs sm:text-base line-clamp-2">{photo.story}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#D2483F] hover:bg-[#B24A3D] text-white p-2 sm:p-3 rounded-full shadow-md z-10 transition-all transform hover:scale-110"
          >
            <span className="text-lg sm:text-xl">❯</span>
          </button>
        </div>

        {/* Indicadores de puntos (mobile friendly) */}
        <div className="flex justify-center gap-2 mt-6">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-[#D2483F] w-6 sm:w-8' : 'bg-[#F3ECE6]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal simplificado: solo imagen + botón Donar ahora */}
      {isModalOpen && selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Botón de cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl z-10 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
            >
              ×
            </button>

            {/* Contenido del modal */}
            <div className="p-4 sm:p-6 pt-10 sm:pt-12">
              <div className="flex flex-col items-center">
                {/* Imagen grande */}
                <img
                  src={selectedCard.src}
                  alt={selectedCard.alt}
                  className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] h-auto rounded-xl sm:rounded-2xl shadow-lg mb-6"
                />

                {/* Botón Donar ahora */}
                <button
                  onClick={openDonationForm}
                  className="bg-[#0B5BA8] hover:bg-[#094A7A] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium text-base sm:text-lg transition-all shadow-md"
                >
                  Donar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;