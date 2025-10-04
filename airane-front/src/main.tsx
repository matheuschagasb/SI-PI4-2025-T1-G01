import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login'
import Signup from './pages/Cadastro/Cadastro';
import { PrimeReactProvider } from 'primereact/api';

// Theme
import 'primereact/resources/themes/saga-orange/theme.css';
// Core
import 'primereact/resources/primereact.min.css';
// Icons
import 'primeicons/primeicons.css';

// Tailwind
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </StrictMode>,
)
