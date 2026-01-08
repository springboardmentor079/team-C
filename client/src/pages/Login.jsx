import React, { useState } from 'react';

const Login = ({ onNavigate, setEmailProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email first!");

    try {
      const res = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }) // Trim panni anupuroam
      });

      const data = await res.json();

      if (data.status === 'ok') {
        alert("OTP Sent Successfully! Check your email.");
        setEmailProp(email); // Inga thaan email-ah save pannitu adutha page-ku porom
        onNavigate('reset-password');
      } else {
        // Inga thaan "User Not Found" alert catch aagum
        alert(data.message || "Something went wrong!");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      data.status === 'ok' ? onNavigate('dashboard') : alert("Invalid Email or Password");
    } catch (err) {
      alert("Server error during login.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F7F2' }}>
      <div style={{ flex: 1, background: '#082435' }}></div>
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '380px', textAlign: 'center' }}>
          <h2>Welcome back to CIVIX</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              style={styles.input} 
              type="email"
              placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              style={styles.input} 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit" style={styles.btn}>Sign In</button>
            <p 
              onClick={handleForgotPassword} 
              style={{ color: '#1e3a8a', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', marginTop: '10px' }}
            >
              Forgot Password?
            </p>
          </form>
          <p style={{ marginTop: '20px' }}>
            No account? <span onClick={() => onNavigate('register')} style={{ fontWeight: 'bold', cursor: 'pointer', color: '#082435' }}>Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' },
  btn: { padding: '16px', background: '#082435', color: '#FFF', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;