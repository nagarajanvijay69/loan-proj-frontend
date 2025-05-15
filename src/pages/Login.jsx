import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [id, setId] = useState('admin123');
  const [password, setPassword] = useState('adminpass123');
  const navigate = useNavigate();
    const PORT = "https://loan-proj-backend.onrender.com";

  const handleLogin = (e) => {
    // e.preventDefault();

    if (id == 'admin123' && password == 'adminpass123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/dashboard');
    } else {
      alert('Invalid ID or Password');
    }
  };

  // useEffect(()=>{
  //   axios.get(PORT)
  //   .then((res)=>{
  //     console.log(res);
  //     });  
  // })

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Admin ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;