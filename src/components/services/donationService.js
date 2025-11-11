// services/donationService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const donationService = {
  /**
   * Obtener todas las donaciones
   * @returns {Promise<Object>} - Lista de donaciones
   */
  getDonations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/donation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('📥 Donaciones obtenidas:', data);
      
      return {
        success: true,
        data: data.data || [], // Asume que los datos vienen en data.data
      };
    } catch (error) {
      console.error('Error al obtener donaciones:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener las donaciones',
        data: [],
      };
    }
  },

  /**
   * Crear una donación
   * @param {Object} donationData - Datos de la donación
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  createDonation: async (donationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('📥 Respuesta del backend:', data);
      
      return {
        success: true,
        data: data, // Devuelve toda la estructura tal como viene del backend
      };
    } catch (error) {
      console.error('Error al crear donación:', error);
      return {
        success: false,
        error: error.message || 'Error al procesar la donación',
      };
    }
  },

  /**
   * Formatear datos para enviar al backend
   * @param {Object} formData - Datos del formulario
   * @param {Object} cartData - Datos del carrito
   * @returns {Object} - Datos formateados según estructura del backend
   */
  formatDonationData: (formData, cartData) => {
    // Formatear hijos como string: "Nombre1 (Grado1), Nombre2 (Grado2)"
    const childrenString = formData.childrenNames
      .map((name, index) => {
        const grade = formData.childrenGrades[index]?.trim() || '';
        return name.trim() && grade ? `${name.trim()} (${grade})` : '';
      })
      .filter(Boolean)
      .join(', ');

    // Formatear people_donor como string: "Nombre: Dylan Zapata, Valor: 100000"
    const peopleDonorString = cartData.cart
      .map(item => `Nombre: ${item.name}, Valor: ${item.price}`)
      .join(' | ');

    return {
      // Tabla people_donor - todos los campos requeridos
      name: formData.name.trim(),
      id_type: formData.id_type,
      id_number: formData.id_number.trim(),
      email: formData.email.trim().toLowerCase(),
      address: formData.address.trim(),
      phone: formData.phone.replace(/\s/g, ''),
      children: childrenString || null,
      people_donor: peopleDonorString, // Nombre y valor en formato string
    };
  },
};