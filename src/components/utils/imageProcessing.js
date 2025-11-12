// utils/imageProcessing.js
import { registerCardId } from './cardsStateManager';

export const getNameFromPath = (path) => {
  const fileName = path.split('/').pop();
  return fileName.replace('.webp', '').replace('.jpg', '').replace('.png', '');
};

const getCategoryFromPath = (path) => {
  const parts = path.split('/');
  const cartsIndex = parts.findIndex(part => part === 'carts');
  if (cartsIndex !== -1 && cartsIndex + 1 < parts.length) {
    return parts[cartsIndex + 1];
  }
  return null;
};

/**
 * 🔥 Procesar imágenes y registrar IDs para sincronización
 */
export const processImages = (imageModules, age) => {
  return Object.keys(imageModules)
    .filter(path => /\.(webp|jpg|png)$/i.test(path))
    .map((path) => {
      const name = getNameFromPath(path);
      const category = getCategoryFromPath(path);
      
      if (!category) {
        console.error('❌ No se pudo extraer categoría de:', path);
        return null;
      }
      
      const tempId = `${age}-${category}-${name}`;
      
      // 🔥 Registrar el ID para que syncWithBackend pueda encontrarlo
      registerCardId(tempId);
      
      return {
        id: tempId,
        src: imageModules[path].default,
        alt: name,
        name: name,
        age: age,
        category: category,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const filterAvailableCards = (cards, donatedCards) => {
  return cards.filter(card => !donatedCards.includes(card.id));
};