import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === 'light' ? 'navbar-light bg-gradient-light' : 'navbar-dark bg-gradient-dark'
      } shadow-lg animate__animated animate__fadeInDown`}
    >
      <div className="container-fluid px-4">
        <a className="navbar-brand d-flex align-items-center" href="/dashboard">
          <i className="fas fa-utensils me-2 text-accent fs-4"></i>
          <span className={`fw-bold fs-4 ${theme === 'light' ? 'text-white' : 'text-accent'}`}>
            RecipeHub
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <a
                    className={`nav-link mx-2 fs-5 ${
                      theme === 'light' ? 'text-white' : 'text-light'
                    } nav-item-hover`}
                    href="/dashboard"
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link mx-2 fs-5 ${
                      theme === 'light' ? 'text-white' : 'text-light'
                    } nav-item-hover`}
                    href="/recipe/new"
                  >
                    New Recipe
                  </a>
                </li>
                <li className="nav-item">
                  <span
                    className={`nav-link mx-2 fs-6 ${
                      theme === 'light' ? 'text-light-muted' : 'text-accent-light'
                    }`}
                  >
                    {currentTime}
                  </span>
                </li>
                <li className="nav-item dropdown mx-2">
                  <button
                    className={`btn ${
                      theme === 'light' ? 'btn-outline-accent' : 'btn-outline-accent-dark'
                    } dropdown-toggle fs-6`}
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user me-1"></i>
                    {currentUser.email.split('@')[0]}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                    <li>
                      <a className="dropdown-item" href="/profile">
                        Profile
                      </a>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a
                    className={`nav-link mx-2 fs-5 ${
                      theme === 'light' ? 'text-white' : 'text-light'
                    } nav-item-hover`}
                    href="/login"
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link mx-2 fs-5 ${
                      theme === 'light' ? 'text-white' : 'text-light'
                    } nav-item-hover`}
                    href="/register"
                  >
                    Register
                  </a>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className={`btn ${
                  theme === 'light' ? 'btn-outline-accent' : 'btn-outline-accent-dark'
                } ms-2 fs-6 theme-toggle`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} me-1`}></i>
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;