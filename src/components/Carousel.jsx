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
  const navigate = useNavigate();

  // Función para extraer el nombre del archivo sin extensión
  const getNameFromPath = (path) => {
    const fileName = path.split('/').pop(); // Obtener el nombre del archivo
    return fileName.replace('.jpg', '').replace('.JPG', ''); // Quitar extensión
  };

  // Función para procesar imágenes de una carpeta
  const processImages = (imageModules, age) => {
    return Object.keys(imageModules)
      .filter(path => /\.(jpg|JPG)$/i.test(path))
      .map((path, index) => {
        const name = getNameFromPath(path);
        
        return {
          id: index + 1,
          src: imageModules[path].default,
          alt: name,
          name: name,
          age: age,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre
  };

  // Procesar cada grupo con edad específica
  const photoGroups = {
    group1: processImages(images_5_6, 6), // Niños de 5-6 años (mostrar 6)
    group2: processImages(images_7_8, 8), // Niños de 7-8 años (mostrar 8)
    group3: processImages(images_9_10, 10), // Niños de 9-10 años (mostrar 10)
  };

  // Verificar si hay fotos
  const totalPhotos = photoGroups.group1.length + photoGroups.group2.length + photoGroups.group3.length;
  
  if (totalPhotos === 0) {
    return (
      <div className="text-center p-8 text-red-600">
        ❌ No se encontraron imágenes en ./assets/carts/
        <br />
        <span className="text-sm">Verifica que existan las carpetas: 5-6/, 7-8/, 9-10/</span>
      </div>
    );
  }

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

  const openModal = (photo) => {
    setSelectedCard(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const openDonationForm = () => {
    closeModal();
    navigate('/donation', { state: { selectedCard } });
  };

  // Componente de carrusel individual
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
                }`}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border-2 sm:border-4 border-[#F3ECE6] hover:border-[#F39C2B] transition-all">
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

  return (
    <>
      <div className="relative max-w-6xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        {/* Carrusel 1: Niños de 5-6 años */}
        <CarouselSection
          groupKey="group1"
          title="🎅 Niños de 5-6 años 🎄"
          subtitle="Los más pequeñitos esperan tu ayuda"
          photos={photoGroups.group1}
        />

        {/* Carrusel 2: Niños de 7-8 años */}
        <CarouselSection
          groupKey="group2"
          title="🎁 Niños de 7-8 años ⭐"
          subtitle="Llenos de ilusión por la Navidad"
          photos={photoGroups.group2}
        />

        {/* Carrusel 3: Niños de 9-10 años */}
        <CarouselSection
          groupKey="group3"
          title="✨ Niños de 9-10 años 🎄"
          subtitle="Esperando hacer realidad sus sueños"
          photos={photoGroups.group3}
        />
      </div>

      {/* Modal */}
      {isModalOpen && selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl z-10 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
            >
              ×
            </button>

            <div className="p-4 sm:p-6 pt-10 sm:pt-12">
              <div className="flex flex-col items-center">
                <img
                  src={selectedCard.src}
                  alt={selectedCard.alt}
                  className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] h-auto rounded-xl sm:rounded-2xl shadow-lg mb-6"
                />
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#D2483F] mb-2">
                    {selectedCard.name}
                  </h3>
                  <p className="text-lg text-[#1E6B3E] font-medium">
                    {selectedCard.age} años
                  </p>
                </div>

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