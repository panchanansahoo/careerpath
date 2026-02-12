import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'; // Restore CSS

import App from './App.jsx';

console.log('Super Safe Main executing...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Render call successful');
} catch (err) {
  console.error('CRITICAL RENDER ERROR:', err);
  document.body.innerHTML = '<h1 style="color:red">CRITICAL ERROR: ' + err.message + '</h1>';
}
