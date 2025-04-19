import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {currentUser && currentUser.email}</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}