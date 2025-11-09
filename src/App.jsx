import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Carousel from './components/Carousel';
import DonationForm from './components/DonationForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative overflow-hidden" style={{ fontFamily: 'Poppins, Roboto, sans-serif' }}>
        {/* Decoración navideña de fondo */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 text-5xl animate-bounce" style={{ color: '#30793b' }}>❄️</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse" style={{ color: '#92C83E' }}>⭐</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-bounce" style={{ color: '#30793b' }}>🎄</div>
          <div className="absolute top-60 right-40 text-3xl animate-pulse" style={{ color: '#ae311a' }}>🎁</div>
          <div className="absolute bottom-40 right-10 text-4xl animate-bounce" style={{ color: '#92C83E' }}>❄️</div>
          <div className="absolute top-20 left-1/2 text-5xl animate-pulse" style={{ color: '#004990' }}>⭐</div>
        </div>

        <Header />

        <main className="relative z-10 container mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<Carousel />} />
            <Route path="/donation" element={<DonationForm />} />
          </Routes>
        </main>

        {/* Footer decorativo */}
        <footer className="relative z-10 text-white py-6 mt-16" style={{ backgroundColor: '#004990' }}>
          <div className="container mx-auto text-center">
            <p className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              🎄 ¡Feliz Navidad y Próspero Año Nuevo! 🎅
            </p>
            <p className="text-sm mt-2 opacity-90" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Bambi International Foundation © 2024
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;