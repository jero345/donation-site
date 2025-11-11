export const getNameFromPath = (path) => {
  const fileName = path.split('/').pop();
  return fileName.replace('.webp', '').replace('.webp', '');
};

export const processImages = (imageModules, age) => {
  return Object.keys(imageModules)
    .filter(path => /\.(webp|webp)$/i.test(path))
    .map((path) => {
      const name = getNameFromPath(path);
      return {
        id: `${age}-${name}`,
        src: imageModules[path].default,
        alt: name,
        name: name,
        age: age,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const filterAvailableCards = (cards, donatedCards) => {
  return cards.filter(card => !donatedCards.includes(card.id));
};