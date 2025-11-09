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
    }
  }, [location.state]);

  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  // Campos de información personal
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');

  // Estado para mostrar errores
  const [errors, setErrors] = useState({});

  const predefinedAmounts = [10, 25, 50, 100, 200];

  const validateForm = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = () => {
    if (!validateForm()) return;

    const finalAmount = amount === 'custom' ? customAmount : amount;
    if (finalAmount) {
      alert(`¡Gracias por tu donación de $${finalAmount} para ${selectedPhoto?.name}! 🎄🎁\n\nNombre: ${nombre}\nApellidos: ${apellidos}\nCorreo: ${email}`);
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
        {/* Información personal */}
        <div className="mb-8 border-b pb-6">
          <h4 className="text-xl font-bold text-[#2F2F2F] mb-4">Información personal</h4>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-[#2F2F2F] font-medium mb-1">
              Nombre <span className="text-red-500">*</span>
              <span className="ml-1 text-xs text-gray-500">?</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9EDB58] focus:border-transparent ${
                errors.nombre ? 'border-red-500 bg-red-50' : 'border-[#1E6B3E] bg-[#F3ECE6]'
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Apellidos */}
          <div className="mb-4">
            <label className="block text-[#2F2F2F] font-medium mb-1">
              Apellidos
              <span className="ml-1 text-xs text-gray-500">?</span>
            </label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder="Apellidos"
              className="w-full px-4 py-3 border-2 border-[#1E6B3E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9EDB58] focus:border-transparent bg-[#F3ECE6]"
            />
          </div>

          {/* Correo electrónico */}
          <div className="mb-4">
            <label className="block text-[#2F2F2F] font-medium mb-1">
              Dirección de correo electrónico <span className="text-red-500">*</span>
              <span className="ml-1 text-xs text-gray-500">?</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Dirección de correo electrónico"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9EDB58] focus:border-transparent ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-[#1E6B3E] bg-[#F3ECE6]'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Monto de donación */}
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

        {/* Botón de donar */}
        <button
          onClick={handleDonate}
          disabled={!amount || (amount === 'custom' && !customAmount) || !nombre || !email}
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