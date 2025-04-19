import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch {
      setError('Failed to create an account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" ref={emailRef} required />
        <label>Password</label>
        <input type="password" ref={passwordRef} required />
        <label>Confirm Password</label>
        <input type="password" ref={passwordConfirmRef} required />
        <button disabled={loading} type="submit">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}