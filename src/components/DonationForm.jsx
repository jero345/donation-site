import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DonationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    if (location.state) {
      setCartData(location.state);
      console.log('Datos recibidos:', location.state);
    }
  }, [location.state]);

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [nombreHijoTCS, setNombreHijoTCS] = useState('');
  const [gradoHijoTCS, setGradoHijoTCS] = useState('');
  const [aceptaPolitica, setAceptaPolitica] = useState(false);

  const [errors, setErrors] = useState({});

  const tiposIdentificacion = [
    'Cédula de Ciudadanía',
    'Cédula de Extranjería',
    'Pasaporte',
    'Tarjeta de Identidad',
    'NIT'
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre completo es obligatorio';
    if (!tipoIdentificacion) newErrors.tipoIdentificacion = 'Selecciona un tipo de identificación';
    if (!numeroIdentificacion.trim()) newErrors.numeroIdentificacion = 'El número de identificación es obligatorio';
    if (!direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
    if (!celular.trim()) {
      newErrors.celular = 'El celular es obligatorio';
    } else if (!/^\d{10}$/.test(celular.replace(/\s/g, ''))) {
      newErrors.celular = 'Ingresa un número de celular válido (10 dígitos)';
    }
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!aceptaPolitica) {
      newErrors.aceptaPolitica = 'Debes aceptar la política de tratamiento de datos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = () => {
    if (!validateForm()) return;

    const donationData = {
      nombreCompleto,
      tipoIdentificacion,
      numeroIdentificacion,
      direccion,
      celular,
      email,
      nombreHijoTCS: nombreHijoTCS || 'No aplica',
      gradoHijoTCS: gradoHijoTCS || 'No aplica',
      carrito: cartData?.cart || [],
      subtotalCartas: cartData?.cardsTotal || 0,
      donacionVoluntaria: cartData?.voluntaryDonation || 0,
      totalPagar: cartData?.totalPrice || 0,
      numeroBeneficiarios: cartData?.numberOfCards || 0
    };

    alert(`¡Gracias por tu donación! 🎄🎁

Datos del donante:
Nombre: ${nombreCompleto}
Identificación: ${tipoIdentificacion} - ${numeroIdentificacion}
Dirección: ${direccion}
Celular: ${celular}
Correo: ${email}

Datos hijo/a TCS:
Nombre: ${donationData.nombreHijoTCS}
Grado: ${donationData.gradoHijoTCS}

Resumen de donación:
Cartas: ${donationData.numeroBeneficiarios}
Subtotal cartas: ${formatPrice(donationData.subtotalCartas)}
Donación voluntaria: ${formatPrice(donationData.donacionVoluntaria)}
TOTAL A PAGAR: ${formatPrice(donationData.totalPagar)}`);
    
    console.log('Datos de donación:', donationData);
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ 
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        fontFamily: 'Poppins, Roboto, sans-serif'
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Resumen del carrito */}
        {cartData && cartData.cart && cartData.cart.length > 0 && (
          <div 
            className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2"
            style={{ borderColor: '#92C83E' }}
          >
            <h3 
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: '#ae311a', fontFamily: 'Poppins, sans-serif' }}
            >
              🎁 Resumen de tu Donación
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
        )}

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-gray-200">
          <div 
            className="text-white p-6 text-center"
            style={{ 
              background: 'linear-gradient(135deg, #30793b 0%, #ae311a 50%, #004990 100%)'
            }}
          >
            <h3 
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              🎁 Completa tus Datos 🎄
            </h3>
            <p 
              className="opacity-90"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Estás a un paso de hacer la diferencia esta Navidad
            </p>
          </div>

          <div className="p-8">
            {/* Información personal */}
            <div className="mb-8 border-b pb-6">
              <h4 
                className="text-xl font-bold mb-4"
                style={{ color: '#2F2F2F', fontFamily: 'Poppins, sans-serif' }}
              >
                Información del Donante
              </h4>

              {/* Nombre completo */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Nombre completo del Donante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.nombreCompleto ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => !errors.nombreCompleto && (e.target.style.borderColor = '#92C83E')}
                  onBlur={(e) => !errors.nombreCompleto && (e.target.style.borderColor = '#d1d5db')}
                />
                {errors.nombreCompleto && (
                  <p 
                    className="text-red-500 text-sm mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {errors.nombreCompleto}
                  </p>
                )}
              </div>

              {/* Tipo de identificación */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Tipo de identificación <span className="text-red-500">*</span>
                </label>
                <select
                  value={tipoIdentificacion}
                  onChange={(e) => setTipoIdentificacion(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.tipoIdentificacion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => !errors.tipoIdentificacion && (e.target.style.borderColor = '#92C83E')}
                  onBlur={(e) => !errors.tipoIdentificacion && (e.target.style.borderColor = '#d1d5db')}
                >
                  <option value="">Selecciona el tipo de identificación</option>
                  {tiposIdentificacion.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipoIdentificacion && (
                  <p 
                    className="text-red-500 text-sm mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {errors.tipoIdentificacion}
                  </p>
                )}
              </div>

              {/* Número de identificación */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Número de identificación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={numeroIdentificacion}
                  onChange={(e) => setNumeroIdentificacion(e.target.value)}
                  placeholder="Ingresa tu número de identificación"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.numeroIdentificacion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => !errors.numeroIdentificacion && (e.target.style.borderColor = '#92C83E')}
                  onBlur={(e) => !errors.numeroIdentificacion && (e.target.style.borderColor = '#d1d5db')}
                />
                {errors.numeroIdentificacion && (
                  <p 
                    className="text-red-500 text-sm mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {errors.numeroIdentificacion}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ingresa tu dirección completa"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.direccion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => !errors.direccion && (e.target.style.borderColor = '#92C83E')}
                  onBlur={(e) => !errors.direccion && (e.target.style.borderColor = '#d1d5db')}
                />
                {errors.direccion && (
                  <p 
                    className="text-red-500 text-sm mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {errors.direccion}
                  </p>
                )}
              </div>

              {/* Celular */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Celular <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="Ingresa tu número de celular"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.celular ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => !errors.celular && (e.target.style.borderColor = '#92C83E')}
                  onBlur={(e) => !errors.celular && (e.target.style.borderColor = '#d1d5db')}
                />
                {errors.celular && (
                  <p 
                    className="text-red-500 text-sm mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {errors.celular}
                  </p>
                )}
              </div>

              {/* Correo electrónico */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => !errors.email && (e.target.style.borderColor = '#92C83E')}
                  onBlur={(e) => !errors.email && (e.target.style.borderColor = '#d1d5db')}
                />
                {errors.email && (
                  <p 
                    className="text-red-500 text-sm mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Información del hijo/a TCS */}
            <div className="mb-8 border-b pb-6">
              <h4 
                className="text-xl font-bold mb-2"
                style={{ color: '#2F2F2F', fontFamily: 'Poppins, sans-serif' }}
              >
                Información hijo/a TCS
              </h4>
              <p 
                className="text-sm text-gray-600 mb-4"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                (Opcional - Solo si tienes un hijo/a en TCS)
              </p>

              {/* Nombre del hijo/a */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Nombre de tu hijo/hija TCS
                </label>
                <input
                  type="text"
                  value={nombreHijoTCS}
                  onChange={(e) => setNombreHijoTCS(e.target.value)}
                  placeholder="Nombre completo de tu hijo/a"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => e.target.style.borderColor = '#92C83E'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Grado del hijo/a */}
              <div className="mb-4">
                <label 
                  className="block font-medium mb-1"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Grado de tu hijo/hija TCS
                </label>
                <input
                  type="text"
                  value={gradoHijoTCS}
                  onChange={(e) => setGradoHijoTCS(e.target.value)}
                  placeholder="Ej: 5°, Jardín, Transición, etc."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  onFocus={(e) => e.target.style.borderColor = '#92C83E'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Política de tratamiento de datos */}
            <div className="mb-6">
              <div 
                className="flex items-start gap-3 p-4 rounded-xl border-2"
                style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
              >
                <input
                  type="checkbox"
                  id="politica"
                  checked={aceptaPolitica}
                  onChange={(e) => setAceptaPolitica(e.target.checked)}
                  className="mt-1 w-5 h-5 border-2 rounded focus:ring-2 cursor-pointer"
                  style={{ 
                    accentColor: '#30793b'
                  }}
                />
                <label 
                  htmlFor="politica" 
                  className="text-sm cursor-pointer"
                  style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Acepto la <span className="font-bold" style={{ color: '#30793b' }}>Política de Tratamiento de Datos</span> y autorizo el uso de mi información personal de acuerdo con la normativa vigente. <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.aceptaPolitica && (
                <p 
                  className="text-red-500 text-sm mt-2 ml-1"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {errors.aceptaPolitica}
                </p>
              )}
            </div>

            {/* Total a pagar destacado */}
            {cartData && cartData.totalPrice > 0 && (
              <div 
                className="text-white p-6 rounded-2xl mb-6 text-center shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #30793b 0%, #92C83E 100%)'
                }}
              >
                <p 
                  className="text-lg font-medium mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Total a Pagar
                </p>
                <p 
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {formatPrice(cartData.totalPrice)}
                </p>
              </div>
            )}

            {/* Botón de donar */}
            <button
              onClick={handleDonate}
              disabled={
                !nombreCompleto || 
                !tipoIdentificacion || 
                !numeroIdentificacion || 
                !direccion || 
                !celular || 
                !email ||
                !aceptaPolitica
              }
              className="w-full text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md hover:opacity-90"
              style={{ 
                background: 'linear-gradient(135deg, #ae311a 0%, #004990 100%)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              🎅 Donar Ahora y Regalar Sonrisas 🎄
            </button>

            <p 
              className="text-center mt-4 text-sm font-medium"
              style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
            >
              ⭐ Tu donación hace la diferencia esta Navidad ⭐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;