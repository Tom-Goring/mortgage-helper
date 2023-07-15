import './index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const domNode = document.getElementById('root');

if (!domNode) {
  throw new Error('Could not find root element');
}

const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
