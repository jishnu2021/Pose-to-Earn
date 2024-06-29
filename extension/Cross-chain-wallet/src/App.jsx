// src/App.jsx

import React from 'react';
import './App.css';
import CryptoForm from './components/CryptoForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Exchange</h1>
      </header>
      <main>
        <CryptoForm />
      </main>
    </div>
  );
}

export default App;
