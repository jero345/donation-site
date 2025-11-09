import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="text-white py-3 sm:py-4 shadow-md" style={{ backgroundColor: '#ae311a' }}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎄</span>
          <img
            src="/src/assets/logo.png"
            alt="The Gift of Sharing"
            className="h-10 sm:h-12 md:h-16 w-auto object-contain"
          />
          <span className="text-xl sm:text-2xl">⭐</span>
        </div>

        {/* Menú de navegación */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link 
            to="/" 
            className="text-white hover:opacity-80 font-medium text-sm sm:text-base transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            INICIO
          </Link>
          <Link
            to="/donation"
            className="text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all transform hover:scale-105 shadow-md hover:opacity-90"
            style={{ backgroundColor: '#92C83E', fontFamily: 'Poppins, sans-serif' }}
          >
            💰 DONAR
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;