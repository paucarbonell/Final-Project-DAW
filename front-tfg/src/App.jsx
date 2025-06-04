import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Album from './pages/Album';
import OpenPacks from './pages/OpenPacks';
import './index.css'; // Asegúrate de que los estilos globales se importen aquí

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album" element={<Album />} />
            <Route path="/open" element={<OpenPacks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
