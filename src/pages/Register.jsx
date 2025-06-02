import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/twig-leaves-around-notepad_23-2147931872.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Navbar />
      <div className="container d-flex align-items-center justify-content-center py-5">
        <div
          className="card shadow-lg border-0 rounded-4 p-4 mt-5"
          style={{
            backdropFilter: 'blur(15px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-md-6 d-none d-md-block">
              <img
                src="https://img.freepik.com/premium-photo/healthy-food-by-color-2019-yogurt-breakfast-bowl-with-copy-space_42124-763.jpg"
                alt="Register Visual"
                className="img-fluid h-100 w-100 rounded-4 object-fit-cover"
                style={{
                  borderTopRightRadius: '0.75rem',
                  borderBottomRightRadius: '0.75rem',
                }}
              />
            </div>

            {/* Register Form */}
            <div className="col-md-6 px-4 py-3 text-white">
              <h2 className="mb-4 text-center fw-bold">Create Account</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <small className="text-warning">
                    Password must be at least 6 characters.
                  </small>
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 mt-3 fw-bold"
                  disabled={password.length < 6}
                >
                  Register
                </button>
              </form>
              <p className="mt-3 text-center text-light">
                Already have an account?{' '}
                <a href="/login" className="text-warning fw-semibold">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
