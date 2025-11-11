import React from 'react';
import { formatPrice } from '../utils/priceFormatting';

const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemoveFromCart,
  getTotalCardsPrice,
  voluntaryDonation,
  setVoluntaryDonation,
  getVoluntaryAmount,
  getTotalPrice,
  onProceedToCheckout 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVoluntaryDonationChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setVoluntaryDonation(value);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl z-10 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
        >
          ×
        </button>

        <div className="p-4 sm:p-6 pt-10 sm:pt-12">
          <h2 
            className="text-2xl sm:text-3xl font-bold mb-6 text-center"
            style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
          >
            🛒 Tu carrito de donaciones
          </h2>

          {cart.length === 0 ? (
            <p 
              className="text-center text-gray-500 py-8"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              No has agregado ninguna carta aún
            </p>
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
                      <h4 
                        className="font-bold text-lg"
                        style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
                      >
                        {item.name}
                      </h4>
                      <p 
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        {item.age} años
                      </p>
                      <p 
                        className="font-bold text-lg"
                        style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
                      >
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-2xl transition-all hover:scale-110"
                      title="Eliminar"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>

              {/* Subtotal de cartas */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center text-lg font-semibold mb-2">
                  <span 
                    className="text-gray-700"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Subtotal cartas:
                  </span>
                  <span 
                    style={{ color: '#30793b', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {formatPrice(getTotalCardsPrice())}
                  </span>
                </div>
                <p 
                  className="text-sm text-gray-600 text-center"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {cart.length} {cart.length === 1 ? 'carta' : 'cartas'} en tu carrito
                </p>
              </div>

              {/* Donación voluntaria adicional */}
              <div 
                className="border-2 p-4 rounded-lg mb-6"
                style={{ 
                  backgroundColor: '#e8f5e9',
                  borderColor: '#92C83E'
                }}
              >
                <label 
                  className="block text-sm font-bold mb-3 text-center"
                  style={{ color: '#30793b', fontFamily: 'Poppins, sans-serif' }}
                >
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
                    className="w-full pl-8 pr-4 py-3 border-2 rounded-lg text-lg font-semibold focus:outline-none transition-all"
                    style={{ 
                      borderColor: '#92C83E',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#30793b'}
                    onBlur={(e) => e.target.style.borderColor = '#92C83E'}
                  />
                </div>
                {getVoluntaryAmount() > 0 && (
                  <p 
                    className="text-sm mt-2 text-center font-medium"
                    style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
                  >
                    Aporte adicional: {formatPrice(getVoluntaryAmount())}
                  </p>
                )}
                <p 
                  className="text-xs text-gray-600 mt-2 text-center italic"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Tu aporte adicional ayuda a hacer posible este evento
                </p>
              </div>

              {/* Total final */}
              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-2xl sm:text-3xl font-bold">
                  <span 
                    style={{ color: '#30793b', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Total:
                  </span>
                  <span 
                    style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full text-white px-6 py-4 rounded-full font-medium text-lg transition-all shadow-md transform hover:scale-105 hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#004990', fontFamily: 'Poppins, sans-serif' }}
              >
                <span>💳</span>
                <span>Proceder al Pago</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;