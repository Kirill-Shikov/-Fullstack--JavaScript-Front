import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layouts/Header/Header';
import { Footer } from './components/layouts/Footer/Footer';
import { HomePage } from './pages/HomePage/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage/SearchResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/search/:query" element={<SearchResultsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;