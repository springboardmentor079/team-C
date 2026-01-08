import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [page, setPage] = useState('login'); 
  const [userEmail, setUserEmail] = useState('');

  return (
    <div>
      {page === 'login' && <Login onNavigate={setPage} setEmailProp={setUserEmail} />}
      {page === 'register' && <Register onNavigate={setPage} />}
      {page === 'reset-password' && <ResetPassword email={userEmail} onNavigate={setPage} />}
      {page === 'dashboard' && <div style={{textAlign:'center', marginTop:'50px'}}><h1>Dashboard</h1><button onClick={() => setPage('login')}>Logout</button></div>}
    </div>
  );
}
export default App;