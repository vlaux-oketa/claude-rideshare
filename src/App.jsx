import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App