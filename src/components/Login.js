import { useState, useEffect } from "react";
import "../CSS_Files/Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Disable scrolling when login mounts
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      //Restore scrolling when login unmounts
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
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
        </form>
        <div className="login-demo-note">
          Demo: Use any username and password to login
        </div>
      </div>
    </div>
  );
}

export default Login;
