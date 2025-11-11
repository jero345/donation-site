

import React from 'react';
import { formatPrice } from '../utils/priceFormatting';

const CarouselSection = ({ 
  groupKey, 
  title, 
  photos, 
  currentIndex,
  onPrevSlide,
  onNextSlide,
  onSetIndex,
  getVisiblePhotos,
  onOpenModal,
  isInCart,
  getCartItem 
}) => {
  if (photos.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2 sm:gap-3"
          style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
        >
          {title}
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={onPrevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white p-2 sm:p-3 rounded-full shadow-md z-10 transition-all transform hover:scale-110 hover:opacity-90"
          style={{ backgroundColor: '#ae311a' }}
        >
          <span className="text-lg sm:text-xl">❮</span>
        </button>

        <div className="flex gap-3 sm:gap-6 justify-center overflow-x-auto pb-4 pt-4 sm:pt-6">
          {getVisiblePhotos(photos, groupKey).map((photo, index) => (
            <div
              key={`${photo.name}-${index}`}
              onClick={() => onOpenModal(photo)}
              className={`cursor-pointer transition-all duration-500 transform ${
                index === 1 ? 'scale-105 sm:scale-110 z-10' : 'scale-90 opacity-75'
              } relative`}
            >
              {isInCart(photo.id) && (
                <div 
                  className="absolute -top-2 -right-2 text-white rounded-full w-8 h-8 flex items-center justify-center z-20 shadow-lg"
                  style={{ backgroundColor: '#92C83E' }}
                >
                  ✓
                </div>
              )}
              
              <div 
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border-2 sm:border-4 hover:border-opacity-80 transition-all"
                style={{ 
                  borderColor: isInCart(photo.id) ? '#92C83E' : '#e5e7eb'
                }}
              >
                <div className="relative">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-40 sm:w-80 h-56 sm:h-96 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-6">
                    <h3 
                      className="text-white font-bold text-lg sm:text-2xl mb-1"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {photo.name}
                    </h3>
                    {isInCart(photo.id) && (
                      <p 
                        className="text-sm sm:text-lg font-bold"
                        style={{ color: '#92C83E', fontFamily: 'Roboto, sans-serif' }}
                      >
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
          onClick={onNextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white p-2 sm:p-3 rounded-full shadow-md z-10 transition-all transform hover:scale-110 hover:opacity-90"
          style={{ backgroundColor: '#ae311a' }}
        >
          <span className="text-lg sm:text-xl">❯</span>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => onSetIndex(index)}
            className="h-2 sm:h-3 rounded-full transition-all"
            style={{
              width: index === currentIndex ? '2rem' : '0.5rem',
              backgroundColor: index === currentIndex ? '#ae311a' : '#d1d5db'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;