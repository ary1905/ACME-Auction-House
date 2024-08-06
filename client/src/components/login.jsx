import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from './Loader';
import '../assets/css/login.css';

export const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred during login');
    }
    setLoading(false);
  };

  return (
    <div id="login">
      {loading && <Loader />}
      <div className="">
        <div className="row">
          <form className="form" onSubmit={handleLogin}>
            <div className="section-title text-center">
              <h2>Login</h2>
              <p>Access your account with ease and start bidding</p>
            </div>
            <label>
              <input
                required
                placeholder="Email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <input
                required
                placeholder="Password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="submit" type="submit" disabled={loading}>Login</button>
            {error && <p className="error">{error}</p>}
            <p className="signin">Don't have an account? <a href="#signup">Sign Up</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};
