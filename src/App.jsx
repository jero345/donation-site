import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Carousel from './components/Carousel';
import DonationForm from './components/DonationForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F3ECE6] relative overflow-hidden">
        {/* Decoración navideña de fondo */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 text-5xl animate-bounce text-[#1E6B3E]">❄️</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse text-[#F39C2B]">⭐</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-bounce text-[#1E6B3E]">🎄</div>
          <div className="absolute top-60 right-40 text-3xl animate-pulse text-[#D2483F]">🎁</div>
          <div className="absolute bottom-40 right-10 text-4xl animate-bounce text-[#9EDB58]">❄️</div>
          <div className="absolute top-20 left-1/2 text-5xl animate-pulse text-[#F39C2B]">⭐</div>
        </div>

        <Header />

        <main className="relative z-10 container mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<Carousel />} />
            <Route path="/donation" element={<DonationForm />} />
          </Routes>
        </main>

        {/* Footer decorativo */}
        <footer className="relative z-10 bg-[#0B5BA8] text-white py-6 mt-16">
          <div className="container mx-auto text-center">
            <p className="text-lg font-semibold">🎄 ¡Feliz Navidad y Próspero Año Nuevo! 🎅</p>
            <p className="text-sm mt-2 text-[#F3ECE6]">Bambi International Foundation © 2024</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;