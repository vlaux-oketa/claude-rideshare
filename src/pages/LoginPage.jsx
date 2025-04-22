import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const Maps = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      Maps('/');
    } catch {
      setError('Failed to log in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Log In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" ref={emailRef} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <button disabled={loading || !navigator.onLine} type="submit">Log In</button>
      </form>
      <div style={{ marginTop: '1em' }}>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <div style={{ marginTop: '1em' }}>
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default LoginPage;
