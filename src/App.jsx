import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default App