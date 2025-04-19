import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions.');
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Password Reset</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" ref={emailRef} placeholder="Email" required />
        <button disabled={loading} type="submit">Reset Password</button>
      </form>
      <p><Link to="/login">Login</Link></p>
    </div>
  );
}
