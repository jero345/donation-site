// DonationForm.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CartSummary from './CartSummary';
import PersonalInfoSection from './PersonalInfoSection';
import ChildrenInfoSection from './ChildrenInfoSection';
import PolicyCheckbox from './PolicyCheckbox';
import WompiSubmitButton from './WompiSubmitButton';

const DonationForm = () => {
  const location = useLocation();
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    if (location.state) {
      setCartData(location.state);
      console.log('Datos recibidos:', location.state);
    }
  }, [location.state]);

  // Estados del formulario
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [nombreHijoTCS, setNombreHijoTCS] = useState([]);
  const [gradoHijoTCS, setGradoHijoTCS] = useState([]);
  const [aceptaPolitica, setAceptaPolitica] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    // Validar hijos TCS
    if (nombreHijoTCS.length > 0 || gradoHijoTCS.length > 0) {
      for (let i = 0; i < Math.max(nombreHijoTCS.length, gradoHijoTCS.length); i++) {
        const nombre = nombreHijoTCS[i] || '';
        const grado = gradoHijoTCS[i] || '';
        if ((nombre.trim() && !grado.trim()) || (!nombre.trim() && grado.trim())) {
          newErrors[`hijo_${i}`] = `Completa ambos campos para el hijo/a #${i + 1}`;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalPagar = cartData?.totalPrice || 0;
  const totalEnCentavos = totalPagar * 100;

  const childNames = cartData?.cart?.map(item => item.name) || [];
  const formattedChildNames = childNames.length > 0
    ? childNames.slice(0, -1).join(', ') + (childNames.length > 1 ? ' y ' : '') + childNames.slice(-1)
    : '';

  const isFormValid = nombreCompleto && tipoIdentificacion && numeroIdentificacion && 
                      direccion && celular && email && aceptaPolitica;

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
        <CartSummary cartData={cartData} />

        {/* Formulario principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-gray-200">
          {/* Header */}
          <div 
            className="text-white p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #30793b)' }}
          >
            <h3 
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Gracias por compartir el regalo más valioso: dar desde el corazón.
            </h3>
            <p 
              className="opacity-90"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Tu generosidad transformará vidas esta Navidad.
            </p>
          </div>

          {/* Mensaje personalizado */}
          {childNames.length > 0 && (
            <div 
              className="text-white p-6 text-center"
              style={{ background: 'linear-gradient(135deg, #30793b)' }}
            >
              <p 
                className="text-xl font-medium"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Con tu aporte, <strong>{formattedChildNames}</strong> tendrán una Navidad inolvidable.
              </p>
            </div>
          )}

          <div className="p-8">
            {/* Información Personal */}
            <PersonalInfoSection
              nombreCompleto={nombreCompleto}
              setNombreCompleto={setNombreCompleto}
              tipoIdentificacion={tipoIdentificacion}
              setTipoIdentificacion={setTipoIdentificacion}
              numeroIdentificacion={numeroIdentificacion}
              setNumeroIdentificacion={setNumeroIdentificacion}
              direccion={direccion}
              setDireccion={setDireccion}
              celular={celular}
              setCelular={setCelular}
              email={email}
              setEmail={setEmail}
              errors={errors}
            />

            {/* Información Hijos TCS */}
            <ChildrenInfoSection
              numberOfCards={cartData?.numberOfCards}
              nombreHijoTCS={nombreHijoTCS}
              setNombreHijoTCS={setNombreHijoTCS}
              gradoHijoTCS={gradoHijoTCS}
              setGradoHijoTCS={setGradoHijoTCS}
              errors={errors}
            />

            {/* Política de datos */}
            <PolicyCheckbox
              aceptaPolitica={aceptaPolitica}
              setAceptaPolitica={setAceptaPolitica}
              errors={errors}
            />

            {/* Total a donar */}
            {cartData && cartData.totalPrice > 0 && (
              <div 
                className="text-white p-6 rounded-2xl mb-6 text-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #30793b 0%, #92C83E 100%)' }}
              >
                <p 
                  className="text-lg font-medium mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Total a donar
                </p>
                <p 
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  ${totalPagar.toLocaleString('es-CO')}
                </p>
              </div>
            )}

            {/* Botón de Wompi */}
            <WompiSubmitButton
              totalEnCentavos={totalEnCentavos}
              isFormValid={isFormValid}
              validateForm={validateForm}
            />

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