// CartSummary.jsx
import React from 'react';

const CartSummary = ({ cartData }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!cartData || !cartData.cart || cartData.cart.length === 0) {
    return null;
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2"
      style={{ borderColor: '#92C83E' }}
    >
      <h3 
        className="text-2xl font-bold mb-4 text-center"
        style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
      >
        🎁 Resumen de tu donación
      </h3>
      
      <div className="space-y-3 mb-4">
        {cartData.cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src={item.src} 
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <p 
                  className="font-semibold"
                  style={{ color: '#2F2F2F', fontFamily: 'Poppins, sans-serif' }}
                >
                  {item.name}
                </p>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {item.age} años
                </p>
              </div>
            </div>
            <p 
              className="font-bold"
              style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
            >
              {formatPrice(item.price)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>
            Subtotal cartas ({cartData.numberOfCards}):
          </span>
          <span 
            className="font-semibold"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {formatPrice(cartData.cardsTotal)}
          </span>
        </div>
        
        {cartData.voluntaryDonation > 0 && (
          <div 
            className="flex justify-between"
            style={{ color: '#30793b' }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              💝 Donación voluntaria:
            </span>
            <span 
              className="font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {formatPrice(cartData.voluntaryDonation)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-2xl font-bold pt-2 border-t-2 border-gray-300">
          <span style={{ color: '#30793b', fontFamily: 'Poppins, sans-serif' }}>
            Total:
          </span>
          <span style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}>
            {formatPrice(cartData.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;