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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Страницы с хедером и футером */}
        <Route path="/" element={
          <>
            <Header />
            <HomePage />
            <Footer />
          </>
        } />
        <Route path="search" element={
          <>
            <Header />
            <SearchResultsPage />
            <Footer />
          </>
        } />
        <Route path="search/:query" element={
          <>
            <Header />
            <SearchResultsPage />
            <Footer />
          </>
        } />
        <Route path="booking/:bookId" element={
          <>
            <Header />
            <BookingPage />
            <Footer />
          </>
        } />
        <Route path="booking-success" element={
          <>
            <Header />
            <BookingSuccessPage />
            <Footer />
          </>
        } />
        
        {/* Профиль - БЕЗ хедера и футера */}
        <Route path="profile/*" element={<ProfilePage />} />
        
        <Route path="*" element={
          <>
            <Header />
            <NotFoundPage />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;