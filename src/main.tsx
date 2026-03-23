import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { UnreadProvider } from './context/UnreadContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <UnreadProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </UnreadProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
