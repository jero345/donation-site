import React, { useState } from 'react';
import { MINIMUM_DONATION, formatPrice } from '../utils/priceFormatting';

const CardModal = ({ 
  selectedCard, 
  isOpen, 
  onClose, 
  onAddToCart,
  isInCart,
  onRemoveFromCart,
  initialAmount 
}) => {
  const [donationAmount, setDonationAmount] = useState(initialAmount);

  if (!isOpen || !selectedCard) return null;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setDonationAmount(value);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(selectedCard, donationAmount);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl z-10 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
        >
          ×
        </button>

        <div className="p-4 sm:p-6 pt-10 sm:pt-12">
          <div className="flex flex-col items-center">
            <img
              src={selectedCard.src}
              alt={selectedCard.alt}
              className="w-full max-w-[90%] sm:max-w-[80%] h-auto rounded-xl sm:rounded-2xl shadow-lg mb-6"
            />
            
            <div className="text-center mb-6 w-full">
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
              >
                {selectedCard.name}
              </h3>
              <p 
                className="text-lg font-medium mb-4"
                style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
              >
                {selectedCard.age} años
              </p>

              <div className="max-w-md mx-auto mb-4">
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
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
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:outline-none transition-all"
                    style={{ 
                      fontFamily: 'Roboto, sans-serif',
                      borderColor: '#92C83E'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#30793b'}
                    onBlur={(e) => e.target.style.borderColor = '#92C83E'}
                  />
                </div>
                {donationAmount && (
                  <p 
                    className="text-sm text-gray-600 mt-2"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Donación: {formatPrice(parseFloat(donationAmount) || 0)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {[90000, 100000, 150000, 200000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount.toString())}
                    className="px-4 py-2 bg-gray-100 hover:text-white rounded-full text-sm font-medium transition-all"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#92C83E'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  >
                    {formatPrice(amount)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              {isInCart(selectedCard.id) ? (
                <>
                  <button
                    onClick={() => {
                      onRemoveFromCart(selectedCard.id);
                      onClose();
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full font-medium transition-all shadow-md"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    🗑 Quitar
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 text-white px-4 py-3 rounded-full font-medium transition-all shadow-md hover:opacity-90"
                    style={{ backgroundColor: '#004990', fontFamily: 'Poppins, sans-serif' }}
                  >
                    💾 Actualizar
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 text-white px-6 py-3 rounded-full font-medium text-lg transition-all shadow-md hover:opacity-90"
                  style={{ backgroundColor: '#92C83E', fontFamily: 'Poppins, sans-serif' }}
                >
                  ➕ Agregar al carrito
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;