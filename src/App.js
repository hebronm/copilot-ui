"use client"

import { useState, useEffect } from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { Dashboard, ClientDetail, IRACalculator, DataAnalysis, EmployeeTable, FAQ } from './components'; // Update index if adding new components


function Navigation({ currentUser, onLogout }) {
  const location = useLocation()
  const showNavTabs = location.pathname === "/calculators";

  return (
    
    <div className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">IRA Calculator Suite</h1>
        </div>
        <div className="header-right">
          <span className="user-welcome">Welcome, {currentUser}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      {/* ✅ Only show nav-tabs on the /calculators route */}
        {showNavTabs && (
          <nav className="nav-tabs">
            <Link to="/iraCalculator" className={`tab-link ${location.pathname === "/iraCalculator" ? "active" : ""}`}>
              IRA Calculator
            </Link>
            <Link to="/analysis" className={`tab-link ${location.pathname === "/analysis" ? "active" : ""}`}>
              Optimal Strategy
            </Link>
            <Link to="/table" className={`tab-link ${location.pathname === "/table" ? "active" : ""}`}>
              Data Table
            </Link>
            <Link to="/faq" className={`tab-link ${location.pathname === "/faq" ? "active" : ""}`}>
            FAQ / Information
            </Link>
          </nav>
        )}
    </div>
    
  )
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && password) {
      onLogin(username)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>IRA Calculator Login</h2>
          <p>Sign in to access your retirement planning tools</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
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
          <div className="form-group">
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
        <div className="login-demo-note">Demo: Use any username and password to login</div>
      </div>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setIsLoggedIn(true)
      setCurrentUser(savedUser)
    }
  }, [])

  const handleLogin = (username) => {
    setIsLoggedIn(true)
    setCurrentUser(username)
    localStorage.setItem("currentUser", username)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser("")
    localStorage.removeItem("currentUser")
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="App">
        <Navigation currentUser={currentUser} onLogout={handleLogout} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/client/:id" element={<ClientDetail />} />
            <Route path="/iraCalculator" element={<IRACalculator />} /> 
            <Route path="/analysis" element={<DataAnalysis />} />
            <Route path="/table" element={<EmployeeTable />} />
            <Route path="/FAQ" element={<FAQ />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
