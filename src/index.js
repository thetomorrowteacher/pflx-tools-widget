import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StudentProvider } from './context/StudentContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StudentProvider>
      <App />
    </StudentProvider>
  </React.StrictMode>
);