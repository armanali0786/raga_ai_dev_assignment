import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute, PublicRoute } from './router/ProtectedRoute';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AppInitializer } from './components/AppInitializer';
import './App.css';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const PatientDetailsPage = lazy(() => import('./pages/PatientDetailsPage'));

const PageFallback = () => <LoadingSpinner fullPage message="Loading page…" />;

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public routes — redirect logged-in users */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Protected routes — require authentication */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/patients/:id" element={<PatientDetailsPage />} />
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
            <ToastContainer />
          </ErrorBoundary>
        </BrowserRouter>
      </AppInitializer>
    </Provider>
  );
}

export default App;
