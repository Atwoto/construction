import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Toaster } from 'react-hot-toast';

import theme from './theme/constructionTheme';
import ModernLayout from './components/modern/ModernLayout';
import ModernDashboard from './pages/modern/ModernDashboard';
import { mockStore } from './data/constructionCRMMockData';
import ProfilePage from './pages/ProfilePage';

// Create emotion cache for MUI
const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    prepend: true, // Theme styles will be inserted at lower precedence than other styles
  });
};

const emotionCache = createEmotionCache();

// Mock user authentication for preview
const mockUser = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@constructioncrm.com',
  role: 'Project Manager',
};

const handleLogout = () => {
  console.log('Logout clicked');
};

function App() {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<ModernLayout user={mockUser} onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<ModernDashboard />} />
              <Route
                path="clients"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Clients - Coming Soon</h1>
                    <p>Modern client management interface will be available here.</p>
                  </div>
                }
              />
              <Route
                path="projects"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Projects - Coming Soon</h1>
                    <p>Advanced project management tools will be available here.</p>
                  </div>
                }
              />
              <Route
                path="invoices"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Invoices - Coming Soon</h1>
                    <p>Invoice management system will be available here.</p>
                  </div>
                }
              />
              <Route
                path="employees"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Employees - Coming Soon</h1>
                    <p>Employee management interface will be available here.</p>
                  </div>
                }
              />
              <Route
                path="inventory"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Inventory - Coming Soon</h1>
                    <p>Inventory tracking system will be available here.</p>
                  </div>
                }
              />
              <Route
                path="documents"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Documents - Coming Soon</h1>
                    <p>Document management system will be available here.</p>
                  </div>
                }
              />
              <Route
                path="reports"
                element={
                  <div style={{ padding: '24px' }}>
                    <h1>Reports - Coming Soon</h1>
                    <p>Advanced reporting and analytics will be available here.</p>
                  </div>
                }
              />
              <Route
                path="profile"
                element={<ProfilePage />}
              />
            </Route>
            <Route
              path="*"
              element={
                <div style={{ 
                  minHeight: '100vh', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937' }}>404</h1>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>Page not found</p>
                  <button
                    onClick={() => window.history.back()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Go Back
                  </button>
                </div>
              }
            />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;