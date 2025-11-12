// components/PaymentCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getStats } from './utils/cardsStateManager';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Procesando tu pago...');
  const [donationInfo, setDonationInfo] = useState(null);

  useEffect(() => {
    console.log('🎯 PaymentCallback iniciado');
    console.log('📝 Parámetros de URL:', Object.fromEntries(searchParams));

    // Obtener información de la última donación
    const savedDonationInfo = localStorage.getItem('lastDonationInfo');
    if (savedDonationInfo) {
      const info = JSON.parse(savedDonationInfo);
      setDonationInfo(info);
      console.log('📦 Información de donación:', info);
    }

    // Obtener parámetros de Wompi
    const transactionId = searchParams.get('id');
    const transactionStatus = searchParams.get('status'); // APPROVED, DECLINED, ERROR

    console.log('💳 Transaction ID:', transactionId);
    console.log('📊 Transaction Status:', transactionStatus);

    // Procesar según el estado
    if (transactionStatus === 'APPROVED') {
      console.log('✅ PAGO APROBADO');
      
      setStatus('success');
      const numCards = donationInfo?.cardIds?.length || 0;
      setMessage(`🎉 ¡Gracias por tu donación!\n\nHas donado ${numCards} carta(s) exitosamente.\n\nLas cartas ya han sido marcadas como donadas.`);
      
      // Limpiar información temporal
      setTimeout(() => {
        localStorage.removeItem('lastDonationInfo');
        console.log('🗑️ lastDonationInfo limpiado');
      }, 1000);
      
      // Redirigir al home después de 5 segundos
      setTimeout(() => {
        console.log('↗️ Redirigiendo al home...');
        navigate('/');
      }, 5000);
      
    } else if (transactionStatus === 'DECLINED') {
      console.log('❌ PAGO RECHAZADO');
      
      setStatus('error');
      setMessage('❌ El pago fue rechazado.\n\n⚠️ IMPORTANTE: Las cartas ya fueron marcadas como donadas al iniciar el proceso.\n\nSi deseas donar otras cartas, por favor selecciónalas nuevamente.');
      
      setTimeout(() => navigate('/'), 5000);
      
    } else if (transactionStatus === 'ERROR') {
      console.log('⚠️ ERROR EN EL PAGO');
      
      setStatus('error');
      setMessage('⚠️ Ocurrió un error durante el pago.\n\n⚠️ IMPORTANTE: Las cartas ya fueron marcadas como donadas al iniciar el proceso.\n\nSi deseas donar otras cartas, por favor selecciónalas nuevamente.');
      
      setTimeout(() => navigate('/'), 5000);
      
    } else {
      console.log('⏳ Estado desconocido o pendiente');
      
      setStatus('processing');
      setMessage('⏳ Tu pago está siendo procesado.\n\nPor favor espera...');
      
      setTimeout(() => {
        navigate('/');
      }, 10000);
    }
  }, [searchParams, navigate, donationInfo]);

  const getStatsDisplay = () => {
    const stats = getStats();
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-600 mb-2">📊 Estadísticas de la campaña:</p>
        <div className="flex gap-4 justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#ae311a' }}>{stats.donated}</p>
            <p className="text-xs text-gray-500">Cartas Donadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#92C83E' }}>{stats.available}</p>
            <p className="text-xs text-gray-500">Disponibles</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-green-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Icono según el estado */}
          <div className="mb-6">
            {status === 'processing' && (
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
              </div>
            )}
            {status === 'success' && (
              <div className="text-6xl mb-4">✅</div>
            )}
            {status === 'error' && (
              <div className="text-6xl mb-4">⚠️</div>
            )}
          </div>

          {/* Título */}
          <h1 
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ 
              color: status === 'success' ? '#30793b' : status === 'error' ? '#ae311a' : '#333',
              fontFamily: 'Poppins, sans-serif' 
            }}
          >
            {status === 'processing' && 'Procesando Pago'}
            {status === 'success' && '¡Donación Exitosa!'}
            {status === 'error' && 'Pago No Completado'}
          </h1>

          {/* Mensaje */}
          <p 
            className="text-lg whitespace-pre-line mb-6"
            style={{ 
              color: '#666',
              fontFamily: 'Roboto, sans-serif' 
            }}
          >
            {message}
          </p>

          {/* Estadísticas (solo en éxito) */}
          {status === 'success' && getStatsDisplay()}

          {/* Información de la donación */}
          {status === 'success' && donationInfo && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">
                📧 Hemos enviado un recibo a: <strong>{donationInfo.formData?.email}</strong>
              </p>
            </div>
          )}

          {/* Botón de acción */}
          <div className="mt-8">
            {status !== 'processing' && (
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-full font-medium text-white shadow-lg transition-all transform hover:scale-105"
                style={{ backgroundColor: status === 'success' ? '#92C83E' : '#ae311a' }}
              >
                {status === 'success' ? '🎄 Volver al Inicio' : '🔄 Volver al Inicio'}
              </button>
            )}
          </div>

          {/* Mensaje de redirección automática */}
          {status !== 'processing' && (
            <p className="text-sm text-gray-400 mt-4">
              Serás redirigido automáticamente en unos segundos...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;