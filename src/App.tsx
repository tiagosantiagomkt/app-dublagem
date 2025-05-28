import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import VideoSection from './components/VideoSection';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Success from './pages/Success';

const HomePage: React.FC = () => {
  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
            Cansado de perder o foco do vídeo
            <br />
            lendo legendas?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transforme qualquer vídeo em conteúdo dublado em português com um clique.
            Mantenha sua atenção no que importa enquanto escuta o conteúdo na sua língua.
          </p>
        </motion.div>

        <VideoSection />
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light-300 text-gray-800">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/success" element={<Success />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App