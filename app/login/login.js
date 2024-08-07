"use client";

import styles from './LoadingSpinner.module.css';
import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useRouter } from 'next/navigation';
import { Box,Typography } from "@mui/material";
import { loginWithEmailAndPassword } from '../firebase-config';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
  document.title = 'Login | BotBuddy';
}, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        router.push('/chat');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with email:", error);
      setError(error.message || "Failed to sign in. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginWithEmailAndPassword(email, password);
      console.log("Logged in successfully:", user);
      // Redirect or update state as needed
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  if (loading) {
    return <Box mt={4} className={styles.loadingContainer}><div className={styles.loadingSpinner}></div></Box>;
  }

  if (user) {
    return <Box mt={4} className={styles.loadingContainer}><div className={styles.loadingSpinner}></div>
    <Typography>Redirecting to chat...</Typography></Box>;
  }

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1>Login</h1>
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
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        
        <div className="divider">Or</div>
        
        <button onClick={handleGoogleSignIn} className="btn btn-secondary">
          Sign in with Google
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Login;