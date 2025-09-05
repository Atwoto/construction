import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import {
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages/auth/AuthPages";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ProjectManagement from "./pages/projects/ProjectManagement";
import ProjectDetailsPage from "./pages/projects/ProjectDetailsPage";
import ClientManagement from "./pages/clients/ClientManagement";
import ClientDetailsPage from "./pages/clients/ClientDetailsPage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { TooltipProvider } from "./components/ui/Tooltip";
import ComponentTestPage from "./pages/ComponentTestPage";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// App Routes Component
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Client Routes */}
        <Route path="clients" element={<ClientManagement />} />
        <Route path="clients/:id" element={<ClientDetailsPage />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="projects/:id" element={<ProjectDetailsPage />} />
        <Route
          path="invoices"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Invoices - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="employees"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Employees - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="inventory"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Inventory - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="documents"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Documents - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="reports"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Reports - Coming Soon</h1>
            </div>
          }
        />
        <Route path="components-test" element={<ComponentTestPage />} />
      </Route>

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <button
                onClick={() => window.history.back()}
                className="btn btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#ffffff",
                  color: "#374151",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </TooltipProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
