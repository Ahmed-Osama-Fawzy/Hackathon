import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import './Styles/index.css';
import './Styles/Main.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <span id='poweredby'> <i className="bi bi-stars"></i> Powered by <a href="https://ahmed-osama.vercel.app/" target="_blank" rel="noreferrer">Eng.Ahmed Osama</a></span>
    <ToastContainer position='bottom-right' autoClose={2000}/>
    <App />
  </React.StrictMode>
);