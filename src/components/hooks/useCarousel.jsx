import { useState } from 'react';

export const useCarousel = () => {
  const [currentIndexes, setCurrentIndexes] = useState({ group1: 0, group2: 0, group3: 0 });

  const nextSlide = (groupKey, photosLength) => {
    if (photosLength === 0) return;
    setCurrentIndexes(prev => ({
      ...prev,
      [groupKey]: (prev[groupKey] + 1) % photosLength
    }));
  };

  const prevSlide = (groupKey, photosLength) => {
    if (photosLength === 0) return;
    setCurrentIndexes(prev => ({
      ...prev,
      [groupKey]: (prev[groupKey] - 1 + photosLength) % photosLength
    }));
  };

  const getVisiblePhotos = (photos, groupKey) => {
    if (photos.length === 0) return [];
    
    const currentIndex = currentIndexes[groupKey];
    const visible = [];
    const displayCount = Math.min(3, photos.length);
    
    for (let i = 0; i < displayCount; i++) {
      visible.push(photos[(currentIndex + i) % photos.length]);
    }
    return visible;
  };

  return {
    currentIndexes,
    setCurrentIndexes,
    nextSlide,
    prevSlide,
    getVisiblePhotos,
  };
};