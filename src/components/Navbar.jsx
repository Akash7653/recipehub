import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="/dashboard">RecipeHub</a>
        <div className="navbar-nav">
          {currentUser ? (
            <>
              <a className="nav-link text-white" href="/dashboard">Dashboard</a>
              <a className="nav-link text-white" href="/recipe/new">New Recipe</a>
              <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a className="nav-link text-white" href="/login">Login</a>
              <a className="nav-link text-white" href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;