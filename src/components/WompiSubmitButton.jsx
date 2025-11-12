// WompiSubmitButton.jsx
import React from 'react';

const WompiSubmitButton = ({ totalEnCentavos, isFormValid, validateForm }) => {
  const handleSubmit = (e) => {
    if (!validateForm()) {
      e.preventDefault();
      alert('Por favor completa todos los campos obligatorios correctamente.');
    }
  };

  return (
    <form action="https://checkout.wompi.co/p/" method="GET" onSubmit={handleSubmit}>
      {/* Public key de Wompi - REEMPLAZA CON TU KEY */}
      <input 
        type="hidden" 
        name="public-key" 
        value="pub_test_FPxYlP6NtsQE2ZRAbsygguBloNbIGU4t" 
      />

      {/* Monto total en centavos */}
      <input 
        type="hidden" 
        name="amount-in-cents" 
        value={totalEnCentavos} 
      />

      {/* Moneda */}
      <input 
        type="hidden" 
        name="currency" 
        value="COP" 
      />

      {/* Referencia única */}
      <input
        type="hidden"
        name="reference"
        value={`DONACION_${Date.now()}`}
      />

      {/* URL de redirección después del pago */}
      <input
        type="hidden"
        name="redirect-url"
        value="https://fundacionthecolumbusschool.com/?v=ab6c04006660"
      />

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md hover:opacity-90"
        style={{ 
          background: 'linear-gradient(135deg, #ae311a 0%, #004990 100%)',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        🎅 Dona ahora y regala sonrisas 🎄
      </button>
    </form>
  );
};

export default WompiSubmitButton;