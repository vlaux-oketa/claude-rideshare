import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import DriverDashboard from './pages/DriverDashboard';
import { APP_VERSION } from './version';

function App() {
  return (
    <div className="container mx-auto px-4 max-w-screen-lg">
      {/* Header with version label */}
      <header className="flex justify-between items-center py-2">
        <h1 className="text-xl font-bold">RideShare</h1>
        <span className="text-xs text-gray-500">v{APP_VERSION}</span>
      </header>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/driver" element={<PrivateRoute><DriverDashboard /></PrivateRoute>} />
          {/* Alias /rider to Dashboard */}
          <Route path="/rider" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App