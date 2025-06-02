import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // optional if you want to move styles there

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1496309732348-3627f3f040ee')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <Navbar />
      <div className="container d-flex align-items-center justify-content-center py-5">
        <div className="card shadow-lg border-0 rounded-4 p-4 mt-5" style={{
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          maxWidth: '900px',
          width: '100%'
        }}>
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-md-6 d-none d-md-block">
              <img
                src="https://img.freepik.com/premium-photo/zucchini-stuffed-with-meat-vegetables_128711-2035.jpg?uid=R136247762&ga=GA1.1.269963768.1747223629&semt=ais_hybrid&w=740"
                alt="login visual"
                className="img-fluid h-100 w-100 rounded-4 object-fit-cover"
                style={{ borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}
              />
            </div>

            {/* Login Form */}
            <div className="col-md-6 px-4 py-3 text-white">
              <h2 className="mb-4 text-center fw-bold">Welcome Back!</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaUser /></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaLock /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Login
                </button>
              </form>
              <p className="mt-3 text-center text-light">
                Don’t have an account? <a href="/register" className="text-warning fw-semibold">Register</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
