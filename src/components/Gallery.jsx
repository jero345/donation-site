import React from 'react';

const Gallery = ({ setSelectedPhoto, selectedPhoto }) => {
  const photos = [
    { id: 1, src: '/assets/photo1.jpg', alt: 'Niño 1' },
    { id: 2, src: '/assets/photo2.jpg', alt: 'Niño 2' },
    { id: 3, src: '/assets/photo3.jpg', alt: 'Niño 3' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-5 mb-8">
      {photos.map(photo => (
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          onClick={() => setSelectedPhoto(photo)}
          className={`w-44 h-44 object-cover cursor-pointer rounded-xl border-4 transition-all duration-300 transform hover:scale-105 shadow-lg ${
            selectedPhoto?.id === photo.id
              ? 'border-green-500 shadow-green-200'
              : 'border-transparent'
          }`}
        />
      ))}
    </div>
  );
};

export default Gallery;