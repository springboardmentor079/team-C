import React, { useState } from 'react';

const Register = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('citizen');

  const colors = {
    bg: '#F9F7F2',
    accent: '#082435ff',
    text: '#1A1A1A',
    secondaryText: '#666',
    border: '#E5E0D5',
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role }),
      });
      if (response.ok) {
        alert("Registration Successful!");
        onNavigate('login');
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg }}>
      
      {/* LEFT SIDE */}
      <div style={{ flex: 1, backgroundColor: colors.accent }}></div>

      {/* RIGHT SIDE: FORM */}
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: colors.text, marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: colors.secondaryText, marginBottom: '35px', fontSize: '15px' }}>Join the community portal.</p>
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: colors.bg, outline: 'none' }} placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
            <input style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: colors.bg, outline: 'none' }} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: colors.bg, outline: 'none' }} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: '900', color: colors.accent }}>ROLE</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button type="button" onClick={() => setRole('citizen')} style={{ flex: 1, padding: '10px', border: role === 'citizen' ? `2px solid ${colors.accent}` : '1px solid #ddd', borderRadius: '10px', background: '#FFF', cursor: 'pointer' }}>Citizen</button>
                <button type="button" onClick={() => setRole('official')} style={{ flex: 1, padding: '10px', border: role === 'official' ? `2px solid ${colors.accent}` : '1px solid #ddd', borderRadius: '10px', background: '#FFF', cursor: 'pointer' }}>Official</button>
              </div>
            </div>

            <button type="submit" style={{ padding: '16px', background: colors.accent, color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Get Started</button>
          </form>

          <p style={{ marginTop: '25px', fontSize: '14px' }}>
            Already a member? <span style={{ color: colors.accent, fontWeight: '700', cursor: 'pointer' }} onClick={() => onNavigate('login')}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;