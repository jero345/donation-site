// services/cardsService.js
// 🔥 Servicio para interactuar con el endpoint de cartas

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const cardsService = {
  /**
   * Obtener todas las cartas desde el backend
   * @returns {Promise<Object>} - Lista de cartas con su estado
   */
  getAllCards: async () => {
    try {
      console.log('🌐 GET request a:', `${API_BASE_URL}/api/v1/card`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/card`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error en GET cartas:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Cartas recibidas del backend:', data);
      
      // 🔥 El backend retorna { success: true, data: [[Prototype]] }
      // Necesitamos acceder al array interno
      let cardsArray = [];
      
      if (Array.isArray(data)) {
        cardsArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        cardsArray = data.data;
      } else if (data[[Prototype]] && Array.isArray(data[[Prototype]])) {
        cardsArray = Object.values(data);
      }
      
      console.log('📦 Cards array extraído:', cardsArray);
      
      return {
        success: true,
        cards: cardsArray,
      };
    } catch (error) {
      console.error('💥 Error en getAllCards:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener las cartas',
        cards: [],
      };
    }
  },

  /**
   * Obtener solo las cartas donadas desde el backend
   * @returns {Promise<Array>} - Array de IDs de cartas donadas
   */
  getDonatedCards: async () => {
    try {
      const result = await cardsService.getAllCards();
      
      console.log('🔍 Resultado de getAllCards:', result);
      
      if (!result.success || !result.cards) {
        console.warn('⚠️ No se pudieron obtener las cartas');
        return [];
      }

      console.log('📋 Total de cartas:', result.cards.length);
      console.log('🔍 Estructura de primera carta:', result.cards[0]);

      // 🔥 Verificar que cards sea un array
      if (!Array.isArray(result.cards)) {
        console.error('❌ result.cards no es un array:', typeof result.cards);
        return [];
      }

      // Filtrar solo las cartas donde donated === true
      const donatedCards = result.cards
        .filter(card => {
          console.log(`   Carta ${card?.ref}: donated = ${card?.donated}`);
          return card && card.donated === true;
        })
        .map(card => card.ref); // El ID está en el campo "ref"
      
      console.log('📊 Cartas donadas obtenidas:', donatedCards);
      
      return donatedCards;
    } catch (error) {
      console.error('💥 Error en getDonatedCards:', error);
      return [];
    }
  },

  /**
   * Verificar si una carta específica está disponible
   * @param {string} cardRef - Referencia de la carta (ej: "5-6-alan-correa")
   * @returns {Promise<boolean>}
   */
  isCardAvailable: async (cardRef) => {
    try {
      const result = await cardsService.getAllCards();
      
      if (!result.success) {
        // Si falla el backend, asumir que está disponible (fallback)
        return true;
      }

      const card = result.cards.find(c => c.ref === cardRef);
      
      if (!card) {
        console.warn(`⚠️ Carta no encontrada: ${cardRef}`);
        return false;
      }

      return card.donated === false;
    } catch (error) {
      console.error('💥 Error en isCardAvailable:', error);
      return true; // Fallback: asumir disponible si hay error
    }
  },

  /**
   * Obtener estadísticas de cartas
   * @returns {Promise<Object>}
   */
  getStats: async () => {
    try {
      const result = await cardsService.getAllCards();
      
      if (!result.success) {
        return { donated: 0, available: 0, total: 0 };
      }

      const total = result.cards.length;
      const donated = result.cards.filter(c => c.donated === true).length;
      const available = total - donated;

      return { donated, available, total };
    } catch (error) {
      console.error('💥 Error en getStats:', error);
      return { donated: 0, available: 0, total: 0 };
    }
  }
};