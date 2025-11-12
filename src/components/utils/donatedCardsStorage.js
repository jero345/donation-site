// utils/donatedCardsStorage.js
const STORAGE_KEY = 'donatedCards';
const PENDING_STORAGE_KEY = 'pendingCards'; // Cartas en proceso de pago

export const donatedCardsStorage = {
  // ========== CARTAS DONADAS (Pagadas) ==========
  
  // Obtener cartas donadas (ya pagadas)
  getDonatedCards: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting donated cards:', error);
      return [];
    }
  },

  // Guardar cartas como donadas (cuando se completa el pago)
  saveDonatedCards: (cardIds) => {
    try {
      const current = donatedCardsStorage.getDonatedCards();
      const updated = [...new Set([...current, ...cardIds])]; // Evitar duplicados
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Limpiar las cartas de "pendientes" ya que ahora están donadas
      donatedCardsStorage.removePendingCards(cardIds);
      
      return updated;
    } catch (error) {
      console.error('Error saving donated cards:', error);
      return current;
    }
  },

  // Verificar si una carta está donada
  isCardDonated: (cardId) => {
    const donated = donatedCardsStorage.getDonatedCards();
    return donated.includes(cardId);
  },

  // ========== CARTAS PENDIENTES (En carritos activos) ==========
  
  // Obtener cartas pendientes
  getPendingCards: () => {
    try {
      const stored = localStorage.getItem(PENDING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting pending cards:', error);
      return [];
    }
  },

  // Agregar cartas a pendientes (cuando se agregan al carrito)
  addPendingCards: (cardIds) => {
    try {
      const current = donatedCardsStorage.getPendingCards();
      const updated = [...new Set([...current, ...cardIds])];
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error adding pending cards:', error);
      return current;
    }
  },

  // Remover cartas de pendientes
  removePendingCards: (cardIds) => {
    try {
      const current = donatedCardsStorage.getPendingCards();
      const updated = current.filter(id => !cardIds.includes(id));
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error removing pending cards:', error);
      return current;
    }
  },

  // Verificar si una carta está pendiente
  isCardPending: (cardId) => {
    const pending = donatedCardsStorage.getPendingCards();
    return pending.includes(cardId);
  },

  // ========== UTILIDADES ==========

  // Verificar si una carta NO está disponible (donada O pendiente)
  isCardUnavailable: (cardId) => {
    return donatedCardsStorage.isCardDonated(cardId) || 
           donatedCardsStorage.isCardPending(cardId);
  },

  // Obtener todas las cartas no disponibles
  getAllUnavailableCards: () => {
    const donated = donatedCardsStorage.getDonatedCards();
    const pending = donatedCardsStorage.getPendingCards();
    return [...new Set([...donated, ...pending])];
  },

  // Limpiar todas las cartas donadas (para desarrollo/testing)
  clearDonatedCards: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing donated cards:', error);
      return false;
    }
  },

  // Limpiar todas las cartas pendientes
  clearPendingCards: () => {
    try {
      localStorage.removeItem(PENDING_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing pending cards:', error);
      return false;
    }
  },

  // Limpiar todo (desarrollo/testing)
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PENDING_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing all cards:', error);
      return false;
    }
  },

  // Obtener estadísticas
  getStats: () => {
    return {
      donated: donatedCardsStorage.getDonatedCards().length,
      pending: donatedCardsStorage.getPendingCards().length,
      total: donatedCardsStorage.getAllUnavailableCards().length
    };
  }
};