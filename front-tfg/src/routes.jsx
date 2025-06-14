import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Album from './pages/Album';
import OpenPacks from './pages/OpenPacks';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/album" element={<Album />} />
      <Route path="/open" element={<OpenPacks />} />
    </Routes>
  );
};

export default AppRoutes; 