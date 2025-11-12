// utils/cardsStateManager.js
// 🔥 Sistema UNIFICADO de gestión de estado de cartas

const CARDS_STATE_KEY = 'cardsState';
const CART_KEY = 'shoppingCart';
const PENDING_DONATION_KEY = 'pendingDonationData';

/**
 * Obtener el estado actual de todas las cartas desde localStorage
 * Si no existe, retorna un objeto vacío (todas disponibles por defecto)
 */
const getCardsState = () => {
  try {
    const stored = localStorage.getItem(CARDS_STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Primera vez: objeto vacío (todas las cartas están disponibles)
    return {};
  } catch (error) {
    console.error('Error getting cards state:', error);
    return {};
  }
};

/**
 * Guardar el estado de las cartas
 */
const saveCardsState = (cardsState) => {
  try {
    localStorage.setItem(CARDS_STATE_KEY, JSON.stringify(cardsState));
    
    // 🔥 EMITIR EVENTO para que otros componentes se enteren del cambio
    window.dispatchEvent(new CustomEvent('cardsStateChanged', { 
      detail: cardsState 
    }));
    
    return cardsState;
  } catch (error) {
    console.error('Error saving cards state:', error);
    return cardsState;
  }
};

/**
 * Verificar si una carta está disponible
 * Si no existe en el estado, está disponible (true por defecto)
 */
export const isCardAvailable = (cardId) => {
  const cardsState = getCardsState();
  // Si la carta no está en el estado, está disponible
  // Si está en el estado, revisar su valor
  return cardsState[cardId] !== false;
};

/**
 * Verificar si una carta está donada
 */
export const isCardDonated = (cardId) => {
  const cardsState = getCardsState();
  return cardsState[cardId] === false;
};

/**
 * 🔥 MARCAR CARTAS COMO DONADAS (state: false)
 * Se ejecuta ANTES de abrir Wompi
 * CRÍTICO: Esta función bloquea las cartas INMEDIATAMENTE
 */
export const markCardsAsDonated = (cardIds) => {
  try {
    console.log('🎯 Marcando cartas como donadas:', cardIds);
    
    const cardsState = getCardsState();
    
    // 🔥 Verificar que todas las cartas estén disponibles ANTES de marcar
    const unavailableCards = cardIds.filter(id => !isCardAvailable(id));
    
    if (unavailableCards.length > 0) {
      console.error('❌ Algunas cartas ya no están disponibles:', unavailableCards);
      return {
        success: false,
        error: 'Algunas cartas ya no están disponibles',
        unavailableCards
      };
    }
    
    // Marcar cada carta como donada (false)
    cardIds.forEach(cardId => {
      cardsState[cardId] = false;
    });
    
    saveCardsState(cardsState);
    console.log('✅ Cartas marcadas como donadas exitosamente');
    console.log('📊 Estado actualizado:', cardsState);
    
    // 🔥 Guardar timestamp de la donación (para auditoría)
    const timestamp = new Date().toISOString();
    try {
      const donationsLog = JSON.parse(localStorage.getItem('donationsLog') || '[]');
      donationsLog.push({
        timestamp,
        cardIds,
        action: 'marked_as_donated'
      });
      localStorage.setItem('donationsLog', JSON.stringify(donationsLog));
    } catch (e) {
      console.error('Error saving donations log:', e);
    }
    
    return {
      success: true,
      donatedCards: Object.keys(cardsState).filter(id => cardsState[id] === false),
      availableCards: Object.keys(cardsState).filter(id => cardsState[id] !== false),
      timestamp
    };
  } catch (error) {
    console.error('❌ Error marking cards as donated:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 🔥 NUEVA: Verificar si el carrito tiene cartas no disponibles
 * Útil para validar ANTES de proceder al checkout
 */
export const validateCartAvailability = (cardIds) => {
  const unavailableCards = cardIds.filter(id => !isCardAvailable(id));
  
  return {
    isValid: unavailableCards.length === 0,
    unavailableCards,
    availableCards: cardIds.filter(id => isCardAvailable(id))
  };
};

/**
 * Obtener todas las cartas disponibles (IDs)
 */
export const getAvailableCards = () => {
  const cardsState = getCardsState();
  // Retornar IDs que NO están marcados como false
  return Object.keys(cardsState).filter(id => cardsState[id] !== false);
};

/**
 * Obtener todas las cartas donadas (IDs)
 */
export const getDonatedCards = () => {
  const cardsState = getCardsState();
  // Retornar IDs que están marcados como false
  return Object.keys(cardsState).filter(id => cardsState[id] === false);
};

/**
 * Obtener estadísticas
 */
export const getStats = () => {
  const cardsState = getCardsState();
  const allCardIds = Object.keys(cardsState);
  const donated = allCardIds.filter(id => cardsState[id] === false).length;
  
  return {
    donated,
    available: 97 - donated, // Total de cartas según tu JSON
    total: 97
  };
};

/**
 * Resetear todas las cartas (para desarrollo/admin)
 */
export const resetAllCards = () => {
  try {
    // Limpiar completamente el estado
    localStorage.removeItem(CARDS_STATE_KEY);
    
    // Limpiar carrito y datos pendientes
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(PENDING_DONATION_KEY);
    
    // Limpiar log de donaciones
    localStorage.removeItem('donationsLog');
    
    console.log('✅ Todas las cartas han sido reseteadas');
    
    // 🔥 EMITIR EVENTO de reset
    window.dispatchEvent(new CustomEvent('cardsStateChanged', { 
      detail: {} 
    }));
    
    return true;
  } catch (error) {
    console.error('❌ Error resetting cards:', error);
    return false;
  }
};

/**
 * Obtener carta por ID desde el estado
 */
export const getCardById = (cardId) => {
  const cardsState = getCardsState();
  return {
    id: cardId,
    state: cardsState[cardId] !== false
  };
};

/**
 * 🔥 NUEVA: Exportar función para suscribirse a cambios
 */
export const subscribeToCardsStateChanges = (callback) => {
  const handler = (event) => callback(event.detail);
  window.addEventListener('cardsStateChanged', handler);
  
  // Retornar función de limpieza
  return () => window.removeEventListener('cardsStateChanged', handler);
};