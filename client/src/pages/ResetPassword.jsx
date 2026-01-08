import React, { useState } from 'react';

const ResetPassword = ({ email, onNavigate }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/reset-password-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      alert("Password updated!");
      onNavigate('login');
    } else alert(data.message);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F9F7F2' }}>
      <div style={{ padding: '30px', background: '#fff', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3>Reset Password for {email}</h3>
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input style={{padding:'12px'}} placeholder="6-digit OTP" onChange={e => setOtp(e.target.value)} required />
          <input style={{padding:'12px'}} type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} required />
          <button type="submit" style={{padding:'12px', background:'#082435', color:'#fff', cursor:'pointer'}}>Update</button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;