// utils/wompiPaymentHandler.js
import { donatedCardsStorage } from './donatedCardsStorage';

/**
 * Maneja el callback de Wompi después de un pago exitoso
 * @param {Array} cardIds - IDs de las cartas que se pagaron
 * @returns {Object} Resultado de la operación
 */
export const handleSuccessfulPayment = (cardIds) => {
  try {
    // Validar que recibimos IDs válidos
    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      console.error('No card IDs provided for successful payment');
      return {
        success: false,
        message: 'No se proporcionaron IDs de cartas'
      };
    }

    console.log('Processing successful payment for cards:', cardIds);

    // 1. Marcar las cartas como donadas (esto también las quita de pendientes)
    const updatedDonatedCards = donatedCardsStorage.saveDonatedCards(cardIds);

    // 2. Limpiar el carrito del localStorage
    localStorage.removeItem('shoppingCart');

    // 3. Log para verificación
    console.log('Cards successfully marked as donated:', updatedDonatedCards);
    console.log('Stats after payment:', donatedCardsStorage.getStats());

    return {
      success: true,
      message: '¡Donación completada exitosamente!',
      donatedCount: cardIds.length,
      stats: donatedCardsStorage.getStats()
    };
  } catch (error) {
    console.error('Error processing successful payment:', error);
    return {
      success: false,
      message: 'Error al procesar el pago',
      error: error.message
    };
  }
};

/**
 * Maneja el caso cuando un pago falla o se cancela
 * @param {Array} cardIds - IDs de las cartas que estaban en el carrito
 * @returns {Object} Resultado de la operación
 */
export const handleFailedPayment = (cardIds) => {
  try {
    console.log('Processing failed/cancelled payment for cards:', cardIds);

    // Las cartas permanecen en el carrito y como pendientes
    // No hacemos nada aquí, el usuario puede volver a intentar

    return {
      success: true,
      message: 'El carrito se ha mantenido para que puedas intentar nuevamente'
    };
  } catch (error) {
    console.error('Error processing failed payment:', error);
    return {
      success: false,
      message: 'Error al procesar el pago fallido',
      error: error.message
    };
  }
};

/**
 * Limpia el carrito y quita las cartas de pendientes
 * (Usar solo cuando el usuario abandona el proceso deliberadamente)
 * @param {Array} cardIds - IDs de las cartas a liberar
 */
export const releaseCards = (cardIds) => {
  try {
    console.log('Releasing cards from pending state:', cardIds);
    
    // Quitar de pendientes
    donatedCardsStorage.removePendingCards(cardIds);
    
    // Limpiar carrito
    localStorage.removeItem('shoppingCart');

    return {
      success: true,
      message: 'Cartas liberadas correctamente'
    };
  } catch (error) {
    console.error('Error releasing cards:', error);
    return {
      success: false,
      message: 'Error al liberar las cartas',
      error: error.message
    };
  }
};

/**
 * Verifica el estado de una transacción
 * (Para implementar cuando tengas el endpoint de Wompi)
 */
export const checkPaymentStatus = async (transactionId) => {
  try {
    // TODO: Implementar llamada a la API de Wompi
    // const response = await fetch(`/api/wompi/transaction/${transactionId}`);
    // const data = await response.json();
    
    console.log('Checking payment status for transaction:', transactionId);
    
    return {
      success: true,
      status: 'APPROVED' // APPROVED, DECLINED, VOIDED, ERROR
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};