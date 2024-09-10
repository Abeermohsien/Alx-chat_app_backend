import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';

function App() {
  const { user, login, register, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [room, setRoom] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    if (user && room) {
      ws.current = new WebSocket('ws://localhost:3000');
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({ type: 'JOIN_ROOM', room, username: user.username }));
      };
      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message.message]);
      };
    }

    return () => {
      if (ws.current) {
        ws.current.send(JSON.stringify({ type: 'LEAVE_ROOM' }));
        ws.current.close();
      }
    };
  }, [user, room]);

  const sendMessage = () => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'MESSAGE', message: input }));
      setInput('');
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        {/* Add form to handle login */}
        <button onClick={() => login('testuser', 'password')}>Login as testuser</button>
        <h2>Register</h2>
        {/* Add form to handle registration */}
        <button onClick={() => register('testuser', 'password')}>Register testuser</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Chat Room: {room}</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
