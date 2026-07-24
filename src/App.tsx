import React from 'react';
import { Header, Footer } from './components/layouts';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <div >
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;