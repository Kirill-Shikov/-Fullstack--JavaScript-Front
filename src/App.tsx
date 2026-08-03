import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layouts/Header/Header';
import { Footer } from './components/layouts/Footer/Footer';
import { HomePage } from './pages/HomePage/HomePage';
import { BookingPage } from './pages/BookingPage/BookingPage';
import { SearchResultsPage } from './pages/SearchResultsPage/SearchResultsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage/BookingSuccessPage';

// Компонент-обертка для страниц с хедером и футером
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Страницы с хедером и футером */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="search" element={<Layout><SearchResultsPage /></Layout>} />
        <Route path="search/:query" element={<Layout><SearchResultsPage /></Layout>} />
        <Route path="booking/:bookId" element={<Layout><BookingPage /></Layout>} />
        <Route path="booking-success" element={<Layout><BookingSuccessPage /></Layout>} />
        
        {/* Профиль - БЕЗ хедера и футера */}
        <Route path="profile/*" element={<ProfilePage />} />
        
        {/* 404 - БЕЗ хедера и футера */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;