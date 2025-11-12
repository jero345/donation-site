// ChildrenInfoSection.jsx
import React from 'react';

const ChildrenInfoSection = ({
  numberOfCards,
  nombreHijoTCS,
  setNombreHijoTCS,
  gradoHijoTCS,
  setGradoHijoTCS,
  errors
}) => {
  if (!numberOfCards || numberOfCards === 0) {
    return null;
  }

  return (
    <div className="mb-8 border-b pb-6">
      <h4 
        className="text-xl font-bold mb-2"
        style={{ color: '#2F2F2F', fontFamily: 'Poppins, sans-serif' }}
      >
        Información hijo/a TCS
      </h4>
      <p 
        className="text-sm text-gray-600 mb-4"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        Queremos que como familia compartan este día con la comunidad, inscribe a tu hijo / a y celebremos juntos (Un estudiante TCS por carta)
      </p>

      {/* Generar tantos formularios como cartas */}
      {[...Array(numberOfCards)].map((_, index) => (
        <div 
          key={index} 
          className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
        >
          <h5 
            className="font-semibold mb-3"
            style={{ color: '#2F2F2F', fontFamily: 'Poppins, sans-serif' }}
          >
            Hijo/a #{index + 1}
          </h5>

          {/* Nombre del hijo/a */}
          <div className="mb-4">
            <label 
              className="block font-medium mb-1"
              style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
            >
              Nombre de tu hijo/hija TCS
            </label>
            <input
              type="text"
              value={nombreHijoTCS[index] || ''}
              onChange={(e) => {
                const updated = [...(nombreHijoTCS || [])];
                updated[index] = e.target.value;
                setNombreHijoTCS(updated);
              }}
              placeholder={`Nombre completo de tu hijo/a #${index + 1}`}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            />
            {errors[`hijo_${index}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`hijo_${index}`]}
              </p>
            )}
          </div>

          {/* Grado del hijo/a */}
          <div className="mb-4">
            <label 
              className="block font-medium mb-1"
              style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
            >
              Grado de tu hijo/hija TCS
            </label>
            <input
              type="text"
              value={gradoHijoTCS[index] || ''}
              onChange={(e) => {
                const updated = [...(gradoHijoTCS || [])];
                updated[index] = e.target.value;
                setGradoHijoTCS(updated);
              }}
              placeholder={`Ej: K4 A, 5°F`}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChildrenInfoSection;