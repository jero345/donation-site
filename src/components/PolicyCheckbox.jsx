// PolicyCheckbox.jsx
import React from 'react';

const PolicyCheckbox = ({ aceptaPolitica, setAceptaPolitica, errors }) => {
  const handlePolicyClick = () => {
    window.open('/proteccion-de-datos-personales.pdf', '_blank');
  };

  return (
    <div className="mb-6">
      <div 
        className="flex flex-wrap gap-2 items-start p-4 rounded-xl border-2"
        style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          id="politica"
          checked={aceptaPolitica}
          onChange={(e) => setAceptaPolitica(e.target.checked)}
          className="w-5 h-5 border-2 rounded focus:ring-2 cursor-pointer mt-1"
          style={{ accentColor: '#30793b' }}
        />

        {/* Contenido responsivo */}
        <div className="flex flex-wrap gap-1 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <label 
            htmlFor="politica" 
            className="cursor-pointer text-sm select-none"
            style={{ color: '#2F2F2F' }}
          >
            Acepto la
          </label>

          <button
            type="button"
            onClick={handlePolicyClick}
            className="text-sm font-bold underline hover:opacity-80 transition-opacity"
            style={{ color: '#30793b' }}
          >
            Política de Tratamiento de Datos
          </button>

          <span 
            className="text-sm"
            style={{ color: '#2F2F2F' }}
          >
            y autorizo el uso de mi información personal de acuerdo con la normativa vigente.
            <span className="text-red-500">*</span>
          </span>
        </div>
      </div>

      {/* Error */}
      {errors.aceptaPolitica && (
        <p 
          className="text-red-500 text-sm mt-2 ml-1"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {errors.aceptaPolitica}
        </p>
      )}

      {/* Botón inferior */}
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={handlePolicyClick}
          className="text-xs underline hover:opacity-80 transition-opacity"
          style={{ color: '#30793b', fontFamily: 'Roboto, sans-serif' }}
        >
          📄 Ver Política de Protección de Datos completa
        </button>
      </div>
    </div>
  );
};

export default PolicyCheckbox;
