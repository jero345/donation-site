import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#D2483F] text-white py-3 sm:py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo más grande */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🎄</span>
          <img
            src="/src/assets/logo.png"
            alt="The Gift of Sharing"
            className="h-10 sm:h-12 md:h-16 w-auto object-contain"
          />
          <span className="text-xl sm:text-2xl">⭐</span>
        </div>

        {/* Menú de navegación con rutas */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-white hover:text-[#F3ECE6] font-medium text-sm sm:text-base transition-colors">
            INICIO
          </Link>
          <Link
            to="/donation"
            className="bg-[#F39C2B] hover:bg-[#E68A20] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all transform hover:scale-105 shadow-md"
          >
            💰 DONAR
          </Link>
          <Link to="/contacto" className="text-white hover:text-[#F3ECE6] font-medium text-sm sm:text-base transition-colors">
            CONTACTO
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;