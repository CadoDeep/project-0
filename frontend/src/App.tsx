import React, { useState, useEffect } from "react";
import Login from "./login";
import CadetsList from "./cadets";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token ? 'Token exists' : 'No token found');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setError(null);
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('Login successful');
      setIsAuthenticated(true);
    } else {
      console.log('No token found after login attempt');
      return;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    console.log('Logged out');
  };

  return (
    <div className="main">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className="navbar">
            <div className="navbar-title">CADO DEEP</div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <CadetsList />
        </>
      )}
    </div>
  );
}

export default App;
