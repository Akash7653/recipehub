import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isOpen, setIsOpen] = useState(false);

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === 'light' ? 'navbar-light bg-light' : 'navbar-dark bg-dark'
      } shadow-lg px-4`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <i className="fas fa-utensils me-2 text-warning fs-4"></i>
          <span className="fw-bold fs-4">RecipeHub</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fs-5" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fs-5" to="/recipe/new">
                    New Recipe
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link fs-6 text-muted">{currentTime}</span>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-outline-warning dropdown-toggle fs-6"
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
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
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
                  <Link
                    className={`nav-link fs-6 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fs-6" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item ms-3">
              <img
                src={
                  theme === 'dark'
                    ? 'https://cdn-icons-png.flaticon.com/512/5260/5260711.png'
                    : 'https://cdn-icons-png.flaticon.com/512/5260/5260705.png'
                }
                alt="Toggle theme"
                onClick={toggleTheme}
                style={{
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
