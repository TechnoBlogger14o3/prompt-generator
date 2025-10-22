import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Clear any existing root content
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
