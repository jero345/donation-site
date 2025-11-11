// utils/donatedCardsStorage.js
const STORAGE_KEY = 'donatedCards';

export const donatedCardsStorage = {
  // Obtener cartas donadas
  getDonatedCards: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al leer cartas donadas:', error);
      return [];
    }
  },

  // Guardar cartas donadas
  saveDonatedCards: (cardIds) => {
    try {
      const current = donatedCardsStorage.getDonatedCards();
      const updated = [...new Set([...current, ...cardIds])]; // Evitar duplicados
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error al guardar cartas donadas:', error);
      return current;
    }
  },

  // Verificar si una carta está donada
  isCardDonated: (cardId) => {
    const donated = donatedCardsStorage.getDonatedCards();
    return donated.includes(cardId);
  },

  // Limpiar todas las cartas donadas (para desarrollo/testing)
  clearDonatedCards: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error al limpiar cartas donadas:', error);
      return false;
    }
  },

  // Obtener cantidad de cartas donadas
  getDonatedCount: () => {
    return donatedCardsStorage.getDonatedCards().length;
  }
};