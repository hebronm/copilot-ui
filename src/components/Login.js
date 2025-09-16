import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import "../CSS_Files/Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //Disable scrolling when login mounts
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      //Restore scrolling when login unmounts
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // TODO: modify this function to handle actual logins
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username && password) {
      const loginData = {
        username: username,
        password: password
      };
      // make the call to the backend
      fetch('http://34.217.130.235:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        navigate('/');
        onLogin(username, data.jwtToken);
      })
      .catch(err => {
        console.error("Error logging in:", err);
        alert("Failed to login. Check console for details.");
      });
      
      
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Financial Copilot Login</h2>
          <p>Sign in to access your financial planning tools</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-section">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Sign In
          </button>
          <button type="button" className="forgot-password-btn"
            onClick={() => {
              // nothing yet, placeholder
              alert("Forgot password clicked (not implemented yet)");
            }}
          >
            Forgot Password?
          </button>
          <div className="signup-prompt">
            Don’t have an account?{" "}
            <button
              type="button"
              className="signup-link"
              onClick={() => alert("Sign up clicked (not implemented yet)")}
            >
            Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
