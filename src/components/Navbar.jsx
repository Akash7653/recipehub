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
          className="navbar-toggler animate__animated animate__pulse animate__infinite"
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
          <div className="navbar-nav ms-auto align-items-center">
            {currentUser ? (
              <>
                <a
                  className={`nav-link mx-2 fs-5 ${
                    theme === 'light' ? 'text-white' : 'text-light'
                  } nav-item-hover animate__animated animate__bounceIn`}
                  href="/dashboard"
                >
                  Dashboard
                </a>
                <a
                  className={`nav-link mx-2 fs-5 ${
                    theme === 'light' ? 'text-white' : 'text-light'
                  } nav-item-hover animate__animated animate__bounceIn animate__delay-1s`}
                  href="/recipe/new"
                >
                  New Recipe
                </a>
                <span
                  className={`nav-item mx-2 fs-6 ${
                    theme === 'light' ? 'text-light-muted' : 'text-accent-light'
                  } animate__animated animate__pulse animate__infinite`}
                >
                  {currentTime}
                </span>
                <div className="dropdown mx-2">
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
                </div>
              </>
            ) : (
              <>
                <a
                  className={`nav-link mx-2 fs-5 ${
                    theme === 'light' ? 'text-white' : 'text-light'
                  } nav-item-hover animate__animated animate__bounceIn`}
                  href="/login"
                >
                  Login
                </a>
                <a
                  className={`nav-link mx-2 fs-5 ${
                    theme === 'light' ? 'text-white' : 'text-light'
                  } nav-item-hover animate__animated animate__bounceIn animate__delay-1s`}
                  href="/register"
                >
                  Register
                </a>
              </>
            )}
            <button
              className={`btn ${
                theme === 'light' ? 'btn-outline-accent' : 'btn-outline-accent-dark'
              } ms-2 fs-6 theme-toggle animate__animated animate__rotateIn`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} me-1`}></i>
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;