import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Album from './pages/Album';
import OpenPacks from './pages/OpenPacks';
import './index.css'; // Ensure global styles are imported here

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto pt-[140px]">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/album" element={<Album />} />
              <Route path="/open" element={<OpenPacks />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
