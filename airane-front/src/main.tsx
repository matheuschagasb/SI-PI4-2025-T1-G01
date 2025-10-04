import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login/Login'
import { PrimeReactProvider } from 'primereact/api';

// Theme
import 'primereact/resources/themes/saga-orange/theme.css';
// Core
import 'primereact/resources/primereact.min.css';
// Icons
import 'primeicons/primeicons.css';

// Tailwind
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
        <Login />
    </PrimeReactProvider>
  </StrictMode>,
)
