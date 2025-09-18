import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import "../CSS_Files/SignupPage.css";

function SignupPage({ onLoginClick }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  // Disable scrolling while signup page is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSignupError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, company, username, password, confirmPassword } = formData;

    if (!firstName || !lastName || !company || !username || !password || !confirmPassword) {
      setSignupError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setSignupError('');
    console.log('Sign up data:', formData);

    const signUpData = {
        firstName: firstName,
        lastName: lastName,
        company: company,
        username: username,
        password: password
    };
    fetch('http://34.217.130.235:8080/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("Username already exists");
            } else {
                throw new Error(`Error: ${res.status}`);
            }
        }
        return res.json();
    })
    .then(data => {
        navigate('/');
        onLoginClick();
    })
    .catch(err => {
        console.error("Error signing up:", err);
        setSignupError(err.message);
    });
    
  };

return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create an Account</h1>
          <p>Sign up to access your financial planning tools</p>
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
                <div className="form-column">
                    <div className="form-section">
                        <label htmlFor="firstName">First Name</label>
                        <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Ex: John"
                        value={formData.firstName}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Ex: Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="company">Company</label>
                        <input
                        id="company"
                        type="text"
                        name="company"
                        placeholder="Ex: Amazon"
                        value={formData.company}
                        onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-column">
                    <div className="form-section">
                        <label htmlFor="username">Username</label>
                        <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter a unique username"
                        value={formData.username}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="password">Password</label>
                        <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {signupError && (
                <div className="signup-error">{signupError}</div>
            )}

            <button type="submit" className="signup-btn">
                Sign Up
            </button>
            <div className="signup-prompt">
                Already have an account?{" "}
                <button
                type="button"
                className="login-link"
                onClick={onLoginClick}
                >
                    Log in
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;