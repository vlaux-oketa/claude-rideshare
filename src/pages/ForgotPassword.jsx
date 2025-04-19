import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Password Reset</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" ref={emailRef} required />
        <button disabled={loading} type="submit">
          Reset Password
        </button>
      </form>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}