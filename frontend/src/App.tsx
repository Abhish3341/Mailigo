import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import CommunicationHistory from './components/Communication/CommunicationHistory';
import ComposeEmail from './components/Communication/ComposeEmail';
import ProfilePage from './components/Profile/ProfilePage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              <Route
                path="/inbox"
                element={<ProtectedRoute element={<CommunicationHistory type="inbox" />} />}
              />
              <Route
                path="/sent"
                element={<ProtectedRoute element={<CommunicationHistory type="sent" />} />}
              />
              <Route
                path="/compose"
                element={<ProtectedRoute element={<ComposeEmail />} />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<ProfilePage />} />}
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;