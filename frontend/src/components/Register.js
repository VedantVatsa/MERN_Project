import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css";

function Register() {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleRegister = () => {
    axios
      .post("https://mern-backend-s5b5.onrender.com/api/register", newUser)
      .then((response) => {
        console.log("User registered successfully");
        setSuccess(true);
        setError(""); // Clear any previous errors
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errmsg
        ) {
          if (error.response.data.errmsg.includes("duplicate key error")) {
            setError(
              "Username or Email already exists. Please choose another."
            );
          } else {
            setError("Registration failed. Please try again.");
          }
        } else {
          setError("Registration failed. Please try again.");
        }
      });
  };

  const validateEmail = (email) => {
    // Basic regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(newUser.email)) {
      handleRegister();
    } else {
      setError("Invalid email format");
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>Register</h2>
        {success ? (
          <p>Registration successful! Redirecting to login page...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={newUser.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="reg-btn" type="submit">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
