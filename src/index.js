import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AlertBoxProvider } from './Providers/AlertBoxProvider';
import { AuthProvider } from './Providers/AuthProvider';
import { ToastProvider } from './Providers/ToastProvider';

ReactDOM.render(
  <React.StrictMode>
    <ToastProvider>
    <AlertBoxProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </AlertBoxProvider>
    </ToastProvider>
  </React.StrictMode>,
  document.getElementById('root')
);