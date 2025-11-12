// utils/cardsStateManager.js
import { cardsService } from '../services/cardService';

const CARDS_STATE_KEY = 'cardsState';
const CARDS_CACHE_KEY = 'cardsCache';
const CACHE_EXPIRY_KEY = 'cardsCacheExpiry';
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * 🔥 Convertir ref del backend a patrón de búsqueda para IDs del frontend
 * Backend ref: "5-6-anthony-upegui"
 * Retorna un patrón para buscar cualquier ID que contenga este ref
 */
const backendRefToFrontendPattern = (backendRef) => {
  // Extraer solo la parte del nombre del ref
  // "5-6-anthony-upegui" → "anthony-upegui"
  const parts = backendRef.split('-');
  if (parts.length >= 3) {
    const namePart = parts.slice(2).join('-'); // "anthony-upegui"
    return namePart;
  }
  return backendRef;
};

/**
 * 🔥 Sincronizar estado con el backend
 * Busca todos los IDs del frontend que coincidan con las cartas donadas del backend
 */
export const syncWithBackend = async () => {
  try {
    console.log('🔄 Sincronizando con backend...');
    
    // Obtener cartas donadas del backend
    const donatedRefs = await cardsService.getDonatedCards();
    console.log('📊 Cartas donadas del backend (refs):', donatedRefs);
    
    if (donatedRefs.length === 0) {
      console.log('✅ No hay cartas donadas');
      return {};
    }
    
    // Obtener TODOS los IDs del localStorage actual (si existen)
    const existingState = JSON.parse(localStorage.getItem(CARDS_STATE_KEY) || '{}');
    const allKnownIds = Object.keys(existingState);
    
    console.log('📋 IDs conocidos en cache:', allKnownIds.length);
    
    const cardsState = {};
    
    // Para cada carta donada en el backend
    donatedRefs.forEach(ref => {
      console.log('🔍 Procesando ref donado:', ref);
      
      // Obtener patrón de búsqueda
      const pattern = backendRefToFrontendPattern(ref);
      console.log('   Patrón de búsqueda:', pattern);
      
      // Buscar todos los IDs del frontend que contengan este patrón
      // Normalizar para comparación: minúsculas, sin acentos
      const normalizedPattern = pattern
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      // Marcar como donados todos los IDs que coincidan
      allKnownIds.forEach(id => {
        const normalizedId = id
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        
        if (normalizedId.includes(normalizedPattern)) {
          cardsState[id] = false; // false = donada
          console.log('   ✅ Marcando como donada:', id);
        }
      });
    });
    
    console.log('📦 Estado de cartas sincronizado:', Object.keys(cardsState).length, 'cartas donadas');
    
    // Guardar en localStorage
    localStorage.setItem(CARDS_STATE_KEY, JSON.stringify(cardsState));
    localStorage.setItem(CARDS_CACHE_KEY, JSON.stringify(cardsState));
    localStorage.setItem(CACHE_EXPIRY_KEY, Date.now() + CACHE_DURATION);
    
    // Emitir evento
    window.dispatchEvent(new CustomEvent('cardsStateChanged', { 
      detail: cardsState 
    }));
    
    return cardsState;
  } catch (error) {
    console.error('❌ Error sincronizando con backend:', error);
    return getCardsState();
  }
};

/**
 * 🔥 Registrar un ID de carta cuando se carga en el frontend
 * Esto permite que syncWithBackend sepa qué IDs buscar
 */
export const registerCardId = (cardId) => {
  try {
    const cardsState = getCardsState();
    
    // Si el ID no está registrado, agregarlo como disponible (true)
    if (!(cardId in cardsState)) {
      cardsState[cardId] = true; // true = disponible
      saveCardsState(cardsState);
    }
  } catch (error) {
    console.error('Error registering card ID:', error);
  }
};

const isCacheExpired = () => {
  const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() > parseInt(expiry);
};

const getCardsState = () => {
  try {
    if (isCacheExpired()) {
      syncWithBackend();
    }
    
    const stored = localStorage.getItem(CARDS_STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {};
  } catch (error) {
    console.error('Error getting cards state:', error);
    return {};
  }
};

const saveCardsState = (cardsState) => {
  try {
    localStorage.setItem(CARDS_STATE_KEY, JSON.stringify(cardsState));
    
    window.dispatchEvent(new CustomEvent('cardsStateChanged', { 
      detail: cardsState 
    }));
    
    return cardsState;
  } catch (error) {
    console.error('Error saving cards state:', error);
    return cardsState;
  }
};

export const isCardAvailable = (cardId) => {
  const cardsState = getCardsState();
  // Si no está en el estado, asumimos que está disponible
  return cardsState[cardId] !== false;
};

export const isCardDonated = (cardId) => {
  const cardsState = getCardsState();
  return cardsState[cardId] === false;
};

export const markCardsAsDonated = (cardIds) => {
  try {
    console.log('🎯 Marcando cartas como donadas:', cardIds);
    
    const cardsState = getCardsState();
    
    const unavailableCards = cardIds.filter(id => !isCardAvailable(id));
    
    if (unavailableCards.length > 0) {
      console.error('❌ Cartas no disponibles:', unavailableCards);
      return {
        success: false,
        error: 'Algunas cartas ya no están disponibles',
        unavailableCards
      };
    }
    
    cardIds.forEach(cardId => {
      cardsState[cardId] = false;
    });
    
    saveCardsState(cardsState);
    
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
    
    console.log('✅ Cartas marcadas en caché local');
    
    return {
      success: true,
      donatedCards: Object.keys(cardsState).filter(id => cardsState[id] === false),
      availableCards: Object.keys(cardsState).filter(id => cardsState[id] !== false),
      timestamp
    };
  } catch (error) {
    console.error('❌ Error marking cards:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const validateCartAvailability = (cardIds) => {
  const unavailableCards = cardIds.filter(id => !isCardAvailable(id));
  
  return {
    isValid: unavailableCards.length === 0,
    unavailableCards,
    availableCards: cardIds.filter(id => isCardAvailable(id))
  };
};

export const getAvailableCards = () => {
  const cardsState = getCardsState();
  return Object.keys(cardsState).filter(id => cardsState[id] !== false);
};

export const getDonatedCards = () => {
  const cardsState = getCardsState();
  return Object.keys(cardsState).filter(id => cardsState[id] === false);
};

export const getStats = async () => {
  try {
    const stats = await cardsService.getStats();
    if (stats.total > 0) {
      return stats;
    }
  } catch (error) {
    console.error('Error obteniendo stats:', error);
  }
  
  const cardsState = getCardsState();
  const allCardIds = Object.keys(cardsState);
  const donated = allCardIds.filter(id => cardsState[id] === false).length;
  
  return {
    donated,
    available: 97 - donated,
    total: 97
  };
};

export const resetAllCards = async () => {
  try {
    localStorage.removeItem(CARDS_STATE_KEY);
    localStorage.removeItem(CARDS_CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
    localStorage.removeItem('shoppingCart');
    localStorage.removeItem('donationsLog');
    
    console.log('✅ Caché limpiado');
    
    await syncWithBackend();
    
    window.dispatchEvent(new CustomEvent('cardsStateChanged', { 
      detail: {} 
    }));
    
    return true;
  } catch (error) {
    console.error('❌ Error resetting cards:', error);
    return false;
  }
};

export const getCardById = (cardId) => {
  const cardsState = getCardsState();
  return {
    id: cardId,
    state: cardsState[cardId] !== false
  };
};

export const subscribeToCardsStateChanges = (callback) => {
  const handler = (event) => callback(event.detail);
  window.addEventListener('cardsStateChanged', handler);
  
  return () => window.removeEventListener('cardsStateChanged', handler);
};

export const convertFrontendIdsToBackendRefs = (frontendIds) => {
  return frontendIds.map(id => {
    const parts = id.split('-');
    if (parts.length >= 3) {
      return parts.slice(1).join('-');
    }
    return id;
  });
};