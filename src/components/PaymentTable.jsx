// src/components/PaymentTable.jsx
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
      
      // Corregir la interpolación de la URL
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
        reference: item.reference,
        name: item.name,
        id_type: item.id_type,
        id_number: item.id_number,
        email: item.email,
        address: item.address,
        phone: item.phone,
        children: item.children, // Aquí está la info del hijo/a TCS
        people_donor: item.people_donor,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        transaction: item.transaction || {},
      }));

      setDonations(formattedDonations);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = date.toLocaleString('es', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${hours}:${minutes}`;
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
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

  // Estado de la transacción
  const getTransactionStatus = (status) => {
    switch (status) {
      case 'APROBADO':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Aprobado</span>;
      case 'PENDIENTE':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'RECHAZADO':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rechazado</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Formatear información del hijo/a TCS
  const formatChildrenInfo = (children) => {
    if (!children || typeof children !== 'string') return 'N/A';
    
    // Si es un string, intentar parsearlo como JSON
    try {
      const parsed = JSON.parse(children);
      if (Array.isArray(parsed)) {
        return parsed.map((child, idx) => {
          const name = child.nombre || 'N/A';
          const grado = child.grado || 'N/A';
          return `${name} (${grado})`;
        }).join(', ');
      }
    } catch (e) {
      // Si no es JSON válido, devolver como está
      return children;
    }
    
    return 'N/A';
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
          <p className="text-red-600 font-medium">⚠ {error}</p>
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#004990', fontFamily: 'Poppins, sans-serif' }}>
          📊 Registro de Donaciones
        </h1>
        <p className="text-lg" style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}>
          Historial completo de donaciones realizadas
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
                  ID / Email
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Dirección
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Hijo/a TCS
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Cartas
                </th>
                <th className="px-4 py-4 text-right text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Valor
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Estado
                </th>
                <th className="px-4 py-4 text-left text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Referencia
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    No hay donaciones registradas
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {donation.name}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <div className="flex flex-col gap-1">
                        <span>{donation.id_type}: {donation.id_number}</span>
                        <span className="text-xs text-gray-500">{donation.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {donation.address || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {formatChildrenInfo(donation.children)}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <div className="flex flex-wrap gap-1">
                        {parseCards(donation.people_donor).map((card, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#e8f5e9', color: '#30793b' }}>
                            {card}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold" style={{ color: '#004990', fontFamily: 'Roboto, sans-serif' }}>
                      {formatPrice(parseAmount(donation.people_donor))}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {getTransactionStatus(donation.status)}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {donation.reference}
                      </code>
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
              {donations.reduce((sum, d) => sum + parseCards(d.people_donor).length, 0)}
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#fff3cd' }}>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Total Recaudado
            </p>
            <p className="text-2xl font-bold" style={{ color: '#856404', fontFamily: 'Poppins, sans-serif' }}>
              {formatPrice(donations.reduce((sum, d) => sum + parseAmount(d.people_donor), 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Botón para ver detalles completos (opcional) */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            console.log('Detalles completos:', donations);
            alert('Los detalles completos están en la consola (F12)');
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          🔍 Ver detalles completos en consola
        </button>
      </div>

    </div>
  );
};

export default PaymentTable;
