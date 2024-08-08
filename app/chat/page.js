'use client'; // Client Component

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = { role: 'user', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...messages, newMessage])
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container">
      <div className="chat-header">
        <h1>Chat</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && <div className="message assistant">AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="input-area" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          style={{ flexGrow: 1, marginRight: '10px' }}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ transform: 'translateY(-7px)' }}>
          Send
        </button>
      </form>
    </div>
  );
}