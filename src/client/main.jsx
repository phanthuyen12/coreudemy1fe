import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './assets/css/course-theme.css';
import './assets/css/layout.css';
import './assets/css/typography.css';
import { AuthProvider } from './context/AuthContext';

// Add dark theme class to body
document.body.classList.add('course-dark-theme', 'dark-theme');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
