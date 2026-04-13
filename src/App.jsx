// App.js - Complete with all routes, authentication, and dark mode
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/admin/AdminPage";
import ReportPage from "./pages/ReportPage";
import LoginPage from "./components/LoginPage";
import PatientInfo from "./pages/PatientInfo";
import AdminSetupPage from "./pages/admin/AdminPage";

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dark, setDark] = useState(() => {
    // Check localStorage or system preference on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const navigate = useNavigate();

  // Apply dark mode class to html element
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Check authentication on mount
  useEffect(() => {
    const session = sessionStorage.getItem("authSession");
    if (session === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("authSession", "authenticated");
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("authSession");
    navigate('/login');
  };

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Protected Routes - Dashboard & Main Pages */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} toggleTheme={toggleTheme} dark={dark} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/tool"
        element={
          isAuthenticated ? (
            <Index onLogout={handleLogout} toggleTheme={toggleTheme} dark={dark} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/report"
        element={
          isAuthenticated ? (
            <ReportPage onLogout={handleLogout} toggleTheme={toggleTheme} dark={dark} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <AdminPage onLogout={handleLogout} toggleTheme={toggleTheme} dark={dark} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* New Routes - Patient Info & Admin Setup */}
      <Route
        path="/patient-info"
        element={
          isAuthenticated ? (
            <PatientInfo onLogout={handleLogout} toggleTheme={toggleTheme} dark={dark} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/admin-setup"
        element={
          isAuthenticated ? (
            <AdminSetupPage onLogout={handleLogout} toggleTheme={toggleTheme} dark={dark} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Catch all - redirect to dashboard or login */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;