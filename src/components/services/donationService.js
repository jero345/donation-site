// services/donationService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const donationService = {
  /**
   * Obtener todas las donaciones
   * @returns {Promise<Object>} - Lista de donaciones
   */
  getDonations: async () => {
    try {
      console.log('🌐 GET request a:', `${API_BASE_URL}/api/v1/donation`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/donation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error en GET:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos del GET:', data);
      
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('💥 Error en getDonations:', error);
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
      console.log('🌐 POST request a:', `${API_BASE_URL}/api/v1/donation`);
      console.log('📤 Datos a enviar:', donationData);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error en POST:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta completa del POST:', data);
      console.log('📦 data.data:', data.data);
      console.log('🔑 data.data?.reference:', data.data?.reference);
      console.log('🔑 data.data?.id:', data.data?.id);
      console.log('🔑 data.reference:', data.reference);
      console.log('🔑 data.id:', data.id);
      
      // Si el POST no devuelve referencia, intentar obtenerla con GET
      let reference = data.data?.reference || data.reference;
      
      if (!reference) {
        console.log('⚠️ POST no devolvió referencia, intentando GET...');
        
        // Intentar obtener el ID de la donación creada
        const donationId = data.data?.id || data.id;
        
        if (donationId) {
          console.log('🔄 Obteniendo referencia con GET usando ID:', donationId);
          const getDonationResult = await donationService.getDonationById(donationId);
          
          if (getDonationResult.success) {
            reference = getDonationResult.data?.reference || getDonationResult.data?.data?.reference;
            console.log('✅ Referencia obtenida del GET:', reference);
          }
        } else {
          // Si no hay ID, intentar GET de todas las donaciones y tomar la última
          console.log('🔄 No hay ID, intentando GET de todas las donaciones...');
          const allDonationsResult = await donationService.getDonations();
          
          if (allDonationsResult.success && allDonationsResult.data.length > 0) {
            // Tomar la última donación (la recién creada)
            const lastDonation = allDonationsResult.data[allDonationsResult.data.length - 1];
            reference = lastDonation?.reference;
            console.log('✅ Referencia de la última donación:', reference);
            console.log('📄 Última donación:', lastDonation);
          }
        }
      }
      
      return {
        success: true,
        data: data,
        reference: reference, // Agregar referencia al nivel superior
      };
    } catch (error) {
      console.error('💥 Error en createDonation:', error);
      return {
        success: false,
        error: error.message || 'Error al procesar la donación',
      };
    }
  },

  /**
   * Obtener una donación específica por ID
   * @param {string} id - ID de la donación
   * @returns {Promise<Object>} - Donación específica
   */
  getDonationById: async (id) => {
    try {
      console.log('🌐 GET request a:', `${API_BASE_URL}/api/v1/donation/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/donation/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error en GET by ID:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos del GET by ID:', data);
      
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('💥 Error en getDonationById:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener la donación',
        data: null,
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
    console.log('🔧 Formateando datos...');
    console.log('   formData:', formData);
    console.log('   cartData:', cartData);
    
    // Formatear hijos como string: "Nombre1 (Grado1), Nombre2 (Grado2)"
    const childrenString = formData.childrenNames
      .map((name, index) => {
        const grade = formData.childrenGrades[index]?.trim() || '';
        return name.trim() && grade ? `${name.trim()} (${grade})` : '';
      })
      .filter(Boolean)
      .join(', ');

    console.log('   childrenString:', childrenString);

    // Formatear people_donor como string: "Nombre: Dylan Zapata, Valor: 100000"
    const peopleDonorString = cartData.cart
      .map(item => `Nombre: ${item.name}, Valor: ${item.price}`)
      .join(' | ');

    console.log('   peopleDonorString:', peopleDonorString);

    const formattedData = {
      // Tabla people_donor - todos los campos requeridos
      name: formData.name.trim(),
      id_type: formData.id_type,
      id_number: formData.id_number.trim(),
      email: formData.email.trim().toLowerCase(),
      address: formData.address.trim(),
      phone: formData.phone.replace(/\s/g, ''),
      children: childrenString || null,
      people_donor: peopleDonorString,
    };

    console.log('✅ Datos formateados:', formattedData);
    
    return formattedData;
  },
};