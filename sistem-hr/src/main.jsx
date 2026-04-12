import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import AppErrorBoundary from './components/state/AppErrorBoundary';
import { HrDataProvider } from './context/HrDataContext';
import { RoleProvider } from './context/RoleContext';
import { appTheme } from './theme';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <RoleProvider>
          <HrDataProvider>
            <AppErrorBoundary>
              <App />
            </AppErrorBoundary>
          </HrDataProvider>
        </RoleProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
