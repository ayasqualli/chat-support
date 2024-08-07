'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = 'BotBuddy | Your friendly AI Assistant';
    setMounted(true);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  if (!mounted) return null;

  return (
    <main className={styles.main}>
      <div className={styles.logoContainer}>
        <Image src="/logo.png" alt="BotBuddy Logo" width={200} height={200}  layout = "responsive" className={styles.logo} />
      </div>

      <section className={styles.hero}>
        <h1 className={styles.animatedWelcome}>Welcome to Your AI Assistant</h1>
        <p>Experience the power of AI-driven conversations and problem-solving.</p>
        <div className={styles.buttonGroup}>
          <button onClick={handleLogin} className={styles.button}>Login</button>
          <button onClick={handleRegister} className={styles.button}>Register</button>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>Natural Conversations</h2>
          <p>Engage in human-like dialogues with our advanced AI.</p>
        </div>
        <div className={styles.feature}>
          <h2>Problem Solving</h2>
          <p>Get help with complex tasks and find innovative solutions.</p>
        </div>
        <div className={styles.feature}>
          <h2>24/7 Availability</h2>
          <p>Access your AI assistant anytime, anywhere.</p>
        </div>
      </section>
    </main>
  );
}