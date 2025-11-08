import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DonationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Recuperar la carta seleccionada desde la navegación
  useEffect(() => {
    if (location.state?.selectedCard) {
      setSelectedPhoto(location.state.selectedCard);
    } else {
      // Si no hay carta seleccionada, puedes redirigir o mostrar un mensaje
      // navigate('/');
    }
  }, [location.state, navigate]);

  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const predefinedAmounts = [10, 25, 50, 100, 200];

  const handleDonate = () => {
    const finalAmount = amount === 'custom' ? customAmount : amount;
    if (finalAmount) {
      alert(`¡Gracias por tu donación de $${finalAmount} para ${selectedPhoto?.name}! 🎄🎁`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#F3ECE6]">
      <div className="bg-gradient-to-r from-[#1E6B3E] via-[#D2483F] to-[#1E6B3E] p-6 text-center">
        <h3 className="text-3xl font-bold text-white mb-2">
          🎁 Regala Esperanza esta Navidad 🎄
        </h3>
        <p className="text-[#F3ECE6]">
          Apoya a <span className="font-bold text-white">{selectedPhoto?.name}</span> y haz su Navidad inolvidable
        </p>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <label className="block text-[#2F2F2F] font-bold mb-3 text-lg">
            Selecciona el monto de tu donación: 💝
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-3 px-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  amount === amt
                    ? 'bg-[#1E6B3E] text-white shadow-md'
                    : 'bg-[#F3ECE6] text-[#2F2F2F] hover:bg-[#9EDB58] hover:text-white border-2 border-[#1E6B3E]/20'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAmount('custom')}
            className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${
              amount === 'custom'
                ? 'bg-[#F39C2B] text-white shadow-md'
                : 'bg-[#F3ECE6] text-[#2F2F2F] hover:bg-[#F39C2B] hover:text-white border-2 border-[#F39C2B]/30'
            }`}
          >
            💰 Otra cantidad
          </button>

          {amount === 'custom' && (
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Ingresa el monto"
              className="w-full mt-3 px-4 py-3 border-2 border-[#1E6B3E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9EDB58] focus:border-transparent bg-[#F3ECE6]"
            />
          )}
        </div>

        <button
          onClick={handleDonate}
          disabled={!amount || (amount === 'custom' && !customAmount)}
          className="w-full bg-gradient-to-r from-[#D2483F] via-[#F39C2B] to-[#D2483F] text-white py-4 rounded-xl font-bold text-lg hover:from-[#B24A3D] hover:via-[#D2483F] hover:to-[#B24A3D] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md"
        >
          🎅 Donar Ahora y Regalar Sonrisas 🎄
        </button>

        <p className="text-center text-[#1E6B3E] mt-4 text-sm font-medium">
          ⭐ Tu donación hace la diferencia esta Navidad ⭐
        </p>
      </div>
    </div>
  );
};

export default DonationForm;