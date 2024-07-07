import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import CreatePost from "./CreatePost";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/create">Create Post</Link>
              </li>
            )}
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Home isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/create"
            element={
              isAuthenticated ? (
                <CreatePost />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
