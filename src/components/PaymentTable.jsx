import React, { useState, useEffect } from 'react';

const PaymentTable = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener donaciones al cargar el componente
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE_URL}/api/v1/donation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las donaciones');
      }

      const result = await response.json();
      
      // Formatear los datos del API al formato del componente
      const formattedDonations = (result.data || []).map((item) => ({
        id: item.id,
        date: formatDate(item.createdAt),
        customer: item.name || 'N/A',
        cards: parseCards(item.people_donor),
        amount: parseAmount(item.people_donor)
      }));

      setDonations(formattedDonations);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha del API
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = date.toLocaleString('es', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${hours}:${minutes}`;
  };

  // Extraer nombres de las cartas del people_donor
  const parseCards = (peopleDonor) => {
    if (!peopleDonor) return [];
    
    // Formato esperado: "Nombre: Dylan Zapata, Valor: 100000 | Nombre: Ana María, Valor: 90000"
    const cards = peopleDonor.split('|').map(entry => {
      const nameMatch = entry.match(/Nombre:\s*([^,]+)/);
      return nameMatch ? nameMatch[1].trim() : null;
    }).filter(Boolean);
    
    return cards.length > 0 ? cards : ['N/A'];
  };

  // Calcular monto total del people_donor
  const parseAmount = (peopleDonor) => {
    if (!peopleDonor) return 0;
    
    // Extraer todos los valores
    const values = peopleDonor.split('|').map(entry => {
      const valueMatch = entry.match(/Valor:\s*(\d+)/);
      return valueMatch ? parseInt(valueMatch[1], 10) : 0;
    });
    
    return values.reduce((sum, val) => sum + val, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando donaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">⚠️ {error}</p>
          <button 
            onClick={fetchDonations}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* Encabezado */}
      <div className="mb-6">
        <h1 
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: '#004990', fontFamily: 'Poppins, sans-serif' }}
        >
          📊 Registro de Donaciones
        </h1>
        <p 
          className="text-lg"
          style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
        >
          Historial de donaciones realizadas
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#004990' }}>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Fecha
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Donante
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Cartas
                </th>
                <th className="px-4 py-4 text-right text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No hay donaciones registradas
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr 
                    key={donation.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {donation.date}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {donation.customer}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <div className="flex flex-wrap gap-1">
                        {donation.cards.map((card, idx) => (
                          <span 
                            key={idx}
                            className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: '#e8f5e9',
                              color: '#30793b'
                            }}
                          >
                            {card}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold" style={{ color: '#004990', fontFamily: 'Roboto, sans-serif' }}>
                      {formatPrice(donation.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Total Donaciones
            </p>
            <p className="text-2xl font-bold" style={{ color: '#30793b', fontFamily: 'Poppins, sans-serif' }}>
              {donations.length}
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#e3f2fd' }}>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Cartas Donadas
            </p>
            <p className="text-2xl font-bold" style={{ color: '#004990', fontFamily: 'Poppins, sans-serif' }}>
              {donations.reduce((sum, d) => sum + d.cards.length, 0)}
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#fff3cd' }}>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Total Recaudado
            </p>
            <p className="text-2xl font-bold" style={{ color: '#856404', fontFamily: 'Poppins, sans-serif' }}>
              {formatPrice(
                donations.reduce((sum, d) => sum + d.amount, 0)
              )}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PaymentTable;