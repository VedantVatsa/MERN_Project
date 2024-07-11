import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    axios
      .post("https://mern-backend-s5b5.onrender.com/api/login", credentials)
      .then((response) => {
        console.log("Login successful:", response.data.message);
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setError(""); // Clear any previous errors
        navigate("/"); // Redirect to home page
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("Login failed. Please check your email and password.");
      });
  };

  const validateEmail = (email) => {
    // Basic regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(credentials.email)) {
      handleLogin();
    } else {
      setError("Invalid email format");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
