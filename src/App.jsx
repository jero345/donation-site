import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Carousel from './components/Carousel';
import DonationForm from './components/DonationForm';

// Importar el logo de The Columbus School
import logoColumbus from '/src/assets/ee.png';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative overflow-hidden flex flex-col" style={{ fontFamily: 'Poppins, Roboto, sans-serif' }}>
        {/* Decoración navideña de fondo */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 text-5xl animate-bounce" style={{ color: '#30793b' }}>❄</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse" style={{ color: '#92C83E' }}>⭐</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-bounce" style={{ color: '#30793b' }}>🎄</div>
          <div className="absolute top-60 right-40 text-3xl animate-pulse" style={{ color: '#ae311a' }}>🎁</div>
          <div className="absolute bottom-40 right-10 text-4xl animate-bounce" style={{ color: '#92C83E' }}>❄</div>
          <div className="absolute top-20 left-1/2 text-5xl animate-pulse" style={{ color: '#004990' }}>⭐</div>
        </div>

        <Header />

        <main className="relative z-10 container mx-auto px-4 py-12 flex-grow">
          <Routes>
            <Route path="/" element={<Carousel />} />
            <Route path="/donation" element={<DonationForm />} />
          </Routes>
        </main>

        {/* Footer Fundación TCS */}
        <footer className="relative z-10 text-white py-12" style={{ background: 'linear-gradient(to right,  #004990)' }}>
          <div className="max-w-6xl mx-auto px-6">
            {/* Contenido principal del footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              
              {/* Sección 1: Información de contacto */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#92C83E', fontFamily: 'Poppins, sans-serif' }}>
                  📧 Contacto
                </h3>
                <div className="space-y-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span style={{ color: '#92C83E' }}>✉</span>
                    <a 
                      href="mailto:fundaciontcs@columbus.edu.co" 
                      className="hover:opacity-80 transition-opacity duration-300 underline"
                    >
                      fundaciontcs@columbus.edu.co
                    </a>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span style={{ color: '#92C83E' }}>📞</span>
                    <a 
                      href="tel:+5760440630" 
                      className="hover:opacity-80 transition-opacity duration-300"
                    >
                      604 406 30 00
                    </a>
                  </div>
                </div>
              </div>

              {/* Sección 2: Redes Sociales */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#92C83E', fontFamily: 'Poppins, sans-serif' }}>
                  🌟 Síguenos
                </h3>
                <div className="flex justify-center">
                  <a
                    href="https://www.instagram.com/fundacion_tcs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{ 
                      background: 'linear-gradient(to right, #92C83E)',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              {/* Sección 3: Mensaje inspirador */}
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#92C83E', fontFamily: 'Poppins, sans-serif' }}>
                  🎄 Fundación TCS
                </h3>
                <p className="leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Sabemos que el regalo más poderoso no es algo que se compra, sino algo que se entrega con el corazón
                </p>
              </div>
            </div>

            {/* Línea divisoria + Logo a la izquierda + Texto centrado */}
            <div className="pt-6" style={{ borderTop: '1px solid rgba(146, 200, 62, 0.3)' }}>
              <div className="flex items-center justify-between gap-4">
                
                {/* Logo The Columbus School - Izquierda */}
                <div className="flex-shrink-0">
                  <img
                    src={logoColumbus}
                    alt="The Columbus School"
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                  />
                </div>

                {/* Texto de copyright + mensaje inspirador - Centrado */}
                <div className="flex-1 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  <p className="text-sm">
                    © {new Date().getFullYear()} Fundación TCS – Todos los derechos reservados
                  </p>
                  <p className="text-xs mt-1 font-medium" style={{ color: '#92C83E' }}>
                    ⭐ Haciendo la diferencia, una donación a la vez ⭐
                  </p>
                </div>

                {/* Espacio vacío a la derecha (opcional) */}
                <div className="w-10 sm:w-20"></div>

              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;