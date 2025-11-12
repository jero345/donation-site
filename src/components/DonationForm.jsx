// components/DonationForm.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartSummary from './CartSummary';
import PersonalInfoSection from './PersonalInfoSection';
import ChildrenInfoSection from './ChildrenInfoSection';
import PolicyCheckbox from './PolicyCheckbox';
import { donationService } from './services/donationService';
import { markCardsAsDonated, validateCartAvailability } from './utils/cardsStateManager';

const DonationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state) {
      setCartData(location.state);
    } else {
      // Redirigir si no hay datos del carrito
      navigate('/');
    }
  }, [location.state, navigate]);

  // Estados del formulario
  const [name, setName] = useState('');
  const [id_type, setIdType] = useState('');
  const [id_number, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [childrenNames, setChildrenNames] = useState([]);
  const [childrenGrades, setChildrenGrades] = useState([]);
  const [aceptaPolitica, setAceptaPolitica] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!id_type) newErrors.id_type = 'Selecciona un tipo de identificación';
    if (!id_number.trim()) newErrors.id_number = 'El número de identificación es obligatorio';
    if (!address.trim()) newErrors.address = 'La dirección es obligatoria';

    if (!phone.trim()) {
      newErrors.phone = 'El celular es obligatorio';
    } else if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un número de celular válido (10 dígitos)';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!aceptaPolitica) {
      newErrors.aceptaPolitica = 'Debes aceptar la política de tratamiento de datos';
    }

    // Validación hijos
    if (childrenNames.length > 0 || childrenGrades.length > 0) {
      for (let i = 0; i < Math.max(childrenNames.length, childrenGrades.length); i++) {
        const nombre = childrenNames[i] || '';
        const grado = childrenGrades[i] || '';
        if ((nombre.trim() && !grado.trim()) || (!nombre.trim() && grado.trim())) {
          newErrors[`child_${i}`] = `Completa ambos campos para el hijo/a #${i + 1}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🚀 Iniciando proceso de donación...');
    
    // 1️⃣ Validar formulario
    if (!validateForm()) {
      console.log('❌ Validación fallida');
      alert('⚠️ Por favor completa todos los campos obligatorios');
      return;
    }

    console.log('✅ Validación exitosa');
    
    // 🔥 2️⃣ VALIDAR DISPONIBILIDAD DE CARTAS ANTES DE TODO
    const cardIds = cartData.cardIds || cartData.cart.map(item => item.id);
    console.log('🎴 Validando disponibilidad de cartas:', cardIds);
    
    const validation = validateCartAvailability(cardIds);
    
    if (!validation.isValid) {
      console.error('❌ Cartas no disponibles:', validation.unavailableCards);
      
      const unavailableNames = cartData.cart
        .filter(item => validation.unavailableCards.includes(item.id))
        .map(item => item.name)
        .join(', ');
      
      alert(
        `⚠️ Lo sentimos, algunas cartas ya no están disponibles:\n\n` +
        `${unavailableNames}\n\n` +
        `Por favor, regresa y selecciona otras cartas.`
      );
      
      // Redirigir al home para que actualice
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
      return;
    }
    
    console.log('✅ Todas las cartas están disponibles');
    setIsSubmitting(true);

    try {
      // Preparar datos para enviar
      const formData = {
        name,
        id_type,
        id_number,
        address,
        phone,
        email,
        childrenNames: childrenNames.filter(n => n.trim()),
        childrenGrades: childrenGrades.filter(g => g.trim()),
      };

      console.log('📝 Datos del formulario:', formData);
      console.log('🛒 Datos del carrito:', cartData);

      const donationData = donationService.formatDonationData(formData, cartData);
      console.log('📦 Datos formateados para enviar:', donationData);

      // 3️⃣ Enviar a la API
      console.log('🌐 Enviando petición al backend...');
      const response = await donationService.createDonation(donationData);
      
      console.log('📦 Respuesta completa del backend:', response);

      if (response.success) {
        // Buscar referencia
        const reference = response.reference || 
                         response.data?.data?.reference || 
                         response.data?.reference;
        
        console.log('🎯 Referencia extraída:', reference);
        
        if (!reference) {
          console.error('❌ ERROR: No se encontró la referencia');
          throw new Error('No se recibió la referencia del backend. Por favor contacta al equipo técnico.');
        }
        
        // 🔥 4️⃣ MARCAR CARTAS COMO DONADAS **INMEDIATAMENTE**
        console.log('🔒 Bloqueando cartas inmediatamente...');
        
        const markResult = markCardsAsDonated(cardIds);
        
        if (!markResult.success) {
          console.error('❌ Error al marcar cartas:', markResult.error);
          alert('⚠️ Error al procesar la donación. Algunas cartas ya no están disponibles.');
          
          // Redirigir al home
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          
          return;
        }
        
        console.log('✅ Resultado de marcar cartas:', markResult);
        
        // 🔥 5️⃣ LIMPIAR CARRITO DEL LOCALSTORAGE
        localStorage.removeItem('shoppingCart');
        console.log('🗑️ Carrito limpiado del localStorage');
        
        // 🔥 6️⃣ ABRIR WOMPI EN NUEVA PESTAÑA
        console.log('💳 Abriendo Wompi en nueva pestaña...');
        openWompiCheckout(reference);
        
        // 🔥 7️⃣ MOSTRAR MENSAJE DE ÉXITO
        alert(
          '✅ ¡Gracias por tu generosidad!\n\n' +
          '🎄 Las cartas han sido reservadas para ti.\n\n' +
          '💳 Se abrió la pasarela de pago en una nueva ventana.\n\n' +
          'Serás redirigido al inicio...'
        );
        
        // 🔥 8️⃣ REDIRIGIR AL HOME CON RECARGA COMPLETA
        console.log('↗️ Redirigiendo al home con recarga...');
        
        // Esperar 1.5 segundos para que el usuario lea el mensaje
        setTimeout(() => {
          window.location.href = '/'; // 🔥 Recarga completa
        }, 1500);
        
      } else {
        console.error('❌ response.success es false');
        throw new Error(response.error || 'Error desconocido del servidor');
      }

    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
      alert(`❌ Error: ${error.message || 'No se pudo procesar la donación. Intenta nuevamente.'}`);
      
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Proceso finalizado');
    }
  };

  // Función para abrir Wompi EN NUEVA PESTAÑA
  const openWompiCheckout = (reference) => {
    console.log('💳 Preparando URL de Wompi...');
    console.log('   Referencia:', reference);
    console.log('   Total a pagar:', totalPagar);
    
    const totalEnCentavos = totalPagar * 100;
    console.log('   Total en centavos:', totalEnCentavos);
    
    // Construir URL de Wompi con parámetros
    const wompiUrl = new URL('https://checkout.wompi.co/p/');
    wompiUrl.searchParams.append('public-key', 'pub_test_FPxYlP6NtsQE2ZRAbsygguBloNbIGU4t');
    wompiUrl.searchParams.append('amount-in-cents', totalEnCentavos);
    wompiUrl.searchParams.append('currency', 'COP');
    wompiUrl.searchParams.append('reference', reference);
    
    console.log('🔗 URL de Wompi construida:', wompiUrl.toString());
    
    // 🔥 Abrir en NUEVA PESTAÑA
    console.log('↗️ Abriendo Wompi en nueva pestaña...');
    const wompiWindow = window.open(wompiUrl.toString(), '_blank');
    
    // Verificar si se bloqueó el popup
    if (!wompiWindow || wompiWindow.closed || typeof wompiWindow.closed === 'undefined') {
      console.warn('⚠️ Popup bloqueado, mostrando enlace manual');
      alert(
        '⚠️ Por favor, permite ventanas emergentes para continuar.\n\n' +
        'O copia este enlace para completar el pago:\n\n' +
        wompiUrl.toString()
      );
    }
  };

  const totalPagar = cartData?.totalPrice || 0;

  const childNames = cartData?.cart?.map(item => item.name) || [];
  const formattedChildNames = childNames.length > 0
    ? childNames.slice(0, -1).join(', ') + (childNames.length > 1 ? ' y ' : '') + childNames.slice(-1)
    : '';

  const isFormValid =
    name && id_type && id_number && address && phone && email && aceptaPolitica;

  if (!cartData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Cargando...</p>
        </div>
      </div>
    );
  }

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

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-gray-200">

          {/* Header */}
          <div 
            className="text-white p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #30793b)' }}
          >
            <h3 className="text-3xl font-bold mb-2">
              Gracias por compartir el regalo más valioso: dar desde el corazón.
            </h3>
            <p className="opacity-90">
              Tu generosidad transformará vidas esta Navidad.
            </p>
          </div>

          {childNames.length > 0 && (
            <div 
              className="text-white p-6 text-center"
              style={{ background: 'linear-gradient(135deg, #30793b)' }}
            >
              <p className="text-xl font-medium">
                Con tu aporte, <strong>{formattedChildNames}</strong> tendrán una Navidad inolvidable.
              </p>
            </div>
          )}

          <div className="p-8">

            {/* Información Personal */}
            <PersonalInfoSection
              nombreCompleto={name}
              setNombreCompleto={setName}
              tipoIdentificacion={id_type}
              setTipoIdentificacion={setIdType}
              numeroIdentificacion={id_number}
              setNumeroIdentificacion={setIdNumber}
              direccion={address}
              setDireccion={setAddress}
              celular={phone}
              setCelular={setPhone}
              email={email}
              setEmail={setEmail}
              errors={errors}
            />

            {/* Información Hijos */}
            <ChildrenInfoSection
              numberOfCards={cartData?.numberOfCards}
              nombreHijoTCS={childrenNames}
              setNombreHijoTCS={setChildrenNames}
              gradoHijoTCS={childrenGrades}
              setGradoHijoTCS={setChildrenGrades}
              errors={errors}
            />

            {/* Política */}
            <PolicyCheckbox
              aceptaPolitica={aceptaPolitica}
              setAceptaPolitica={setAceptaPolitica}
              errors={errors}
            />

            {/* Total */}
            {cartData && cartData.totalPrice > 0 && (
              <div 
                className="text-white p-6 rounded-2xl mb-6 text-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #30793b 0%, #92C83E 100%)' }}
              >
                <p className="text-lg font-medium mb-2">Total a donar</p>
                <p className="text-4xl font-bold">
                  ${totalPagar.toLocaleString('es-CO')}
                </p>
              </div>
            )}

            {/* Botón de envío */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold text-xl transition-all shadow-lg ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando y bloqueando cartas...
                </span>
              ) : (
                '🎅 Dona ahora y regala sonrisas 🎄'
              )}
            </button>

            <p className="text-center mt-4 text-sm font-medium" style={{ color: '#30793b' }}>
              ⭐ Tu donación hace la diferencia esta Navidad ⭐
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;