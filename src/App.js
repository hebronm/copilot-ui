"use client"

import { useState, useEffect } from "react"
import "./CSS_Files/App.css"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import { Login, Dashboard, ClientDetail, ClientAdd, ClientTable, IRACalculator, DataAnalysis, EmployeeTable, FAQ, SignupPage } from './components'; // Update index if adding new components


function Navigation({ currentUser, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  const showNavTabs = location.pathname === "/calculators";
  const isClientDetailPage = location.pathname.startsWith("/client/");
  const isDashboardPage = location.pathname === "/";

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    
    <div className="app-header">
      <div className="header-content">
        <div className="header-left">
          <button className="app-title" onClick={handleBackClick}>
            Financial Copilot Suite
          </button>
        </div>
        <div className="header-right">
          {!isClientDetailPage && isDashboardPage && (
            <button
              className="debug-btn"
              onClick={() => navigate("/clientTable")}>
              DEBUG
            </button>
          )}
          
          {/* Show this button only on Client Detail page, not on Dashboard */}
          {isClientDetailPage && !isDashboardPage && (
            <button className="back-btn" onClick={handleBackClick}>
              ← Dashboard
            </button>
          )}
          <span className="user-welcome">Welcome, {currentUser}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      {/* Only show nav-tabs on the /calculators route */}
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

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}


function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [isSignedUp, setIsSignedUp] = useState(false)
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setIsLoggedIn(true)
      setCurrentUser(savedUser)
    }
  }, [])

  const handleLogin = (username, jwt) => {
    setIsLoggedIn(true)
    setCurrentUser(username)
    localStorage.setItem("currentUser", username)
    localStorage.setItem("jwtToken", jwt)

    //redirect to dash immediately
    navigate("/");
  }

  const handleSignup = () => {
    setIsSignedUp(true)
  }

  const onLoginClick = () => {
    setIsSignedUp(false)
  }

  const handleLogout = () => {
    navigate("/"); //to clear the address bar
    setIsLoggedIn(false)
    setCurrentUser("")
    localStorage.removeItem("currentUser")
  }

  if (!isLoggedIn) {
    if (isSignedUp) {
      return <SignupPage onLoginClick={onLoginClick}/>
    }
    return <Login onLogin={handleLogin} onSignup={handleSignup} />
  }

  return (
    <div className="App">
      <Navigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/client/:id" element={<ClientDetail />} />
          <Route path="/newClient" element={<ClientAdd />} />
          <Route path="/iraCalculator" element={<IRACalculator />} /> 
          <Route path="/analysis" element={<DataAnalysis />} />
          <Route path="/table" element={<EmployeeTable />} />
          <Route path="/clientTable" element={<ClientTable />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
