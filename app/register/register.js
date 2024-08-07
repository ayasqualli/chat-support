'use client'; // Client Component

import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerWithEmailAndPassword, signInWithGoogle } from "../firebase-config";



const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Register | BotBuddy';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      await registerWithEmailAndPassword(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Redirect to login page after successful registration
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => router.push('/chat'), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        
        <div className="divider">Or</div>
        
        <button onClick={handleGoogleSignIn} className="btn btn-secondary">
          Sign up with Google
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Registration successful! Redirecting to login...</div>}
    </div>
  );
};
            
export default Register;
