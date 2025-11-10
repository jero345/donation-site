// PersonalInfoSection.jsx
import React from 'react';

const PersonalInfoSection = ({
  nombreCompleto,
  setNombreCompleto,
  tipoIdentificacion,
  setTipoIdentificacion,
  numeroIdentificacion,
  setNumeroIdentificacion,
  direccion,
  setDireccion,
  celular,
  setCelular,
  email,
  setEmail,
  errors
}) => {
  const tiposIdentificacion = [
    'Cédula de Ciudadanía',
    'Cédula de Extranjería',
    'Pasaporte',
    'Tarjeta de Identidad',
    'NIT'
  ];

  return (
    <div className="mb-8 border-b pb-6">
      <h4 
        className="text-xl font-bold mb-4"
        style={{ color: '#2F2F2F', fontFamily: 'Poppins, sans-serif' }}
      >
        Información del Donante
      </h4>

      {/* Nombre completo */}
      <div className="mb-4">
        <label 
          className="block font-medium mb-1"
          style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
        >
          Nombre completo del Donante <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          placeholder="Ingresa tu nombre completo"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
            errors.nombreCompleto ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
        {errors.nombreCompleto && (
          <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {errors.nombreCompleto}
          </p>
        )}
      </div>

      {/* Tipo de identificación */}
      <div className="mb-4">
        <label 
          className="block font-medium mb-1"
          style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
        >
          Tipo de identificación <span className="text-red-500">*</span>
        </label>
        <select
          value={tipoIdentificacion}
          onChange={(e) => setTipoIdentificacion(e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
            errors.tipoIdentificacion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          <option value="">Selecciona el tipo de identificación</option>
          {tiposIdentificacion.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        {errors.tipoIdentificacion && (
          <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {errors.tipoIdentificacion}
          </p>
        )}
      </div>

      {/* Número de identificación */}
      <div className="mb-4">
        <label 
          className="block font-medium mb-1"
          style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
        >
          Número de identificación <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={numeroIdentificacion}
          onChange={(e) => setNumeroIdentificacion(e.target.value)}
          placeholder="Ingresa tu número de identificación"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
            errors.numeroIdentificacion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
        {errors.numeroIdentificacion && (
          <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {errors.numeroIdentificacion}
          </p>
        )}
      </div>

      {/* Dirección */}
      <div className="mb-4">
        <label 
          className="block font-medium mb-1"
          style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
        >
          Dirección <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ingresa tu dirección completa"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
            errors.direccion ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
        {errors.direccion && (
          <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {errors.direccion}
          </p>
        )}
      </div>

      {/* Celular */}
      <div className="mb-4">
        <label 
          className="block font-medium mb-1"
          style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
        >
          Celular <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          placeholder="Ingresa tu número de celular"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
            errors.celular ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
        {errors.celular && (
          <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {errors.celular}
          </p>
        )}
      </div>

      {/* Correo electrónico */}
      <div className="mb-4">
        <label 
          className="block font-medium mb-1"
          style={{ color: '#2F2F2F', fontFamily: 'Roboto, sans-serif' }}
        >
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {errors.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;