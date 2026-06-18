import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const isActive = (path) => {
    return location.pathname === path ? 'active font-weight-bold text-white' : 'text-secondary';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3" style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-shield-exclamation fs-3 text-primary me-2" style={{ color: 'var(--accent-purple) !important' }}></i>
          <span className="fw-bold tracking-wide" style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ResolveGrid
          </span>
        </Link>
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
          <ul className="navbar-nav ms-auto gap-3">
            {token ? (
              <>
                {role === 'admin' && (
                  <li className="nav-item">
                    <Link className={`nav-link d-flex align-items-center gap-2 ${isActive('/admin')}`} to="/admin">
                      <i className="bi bi-speedometer2"></i>
                      Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className={`nav-link d-flex align-items-center gap-2 ${isActive('/complaints')}`} to="/complaints">
                    <i className="bi bi-grid-1x2"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link d-flex align-items-center gap-2 ${isActive('/submit')}`} to="/submit">
                    <i className="bi bi-plus-circle"></i>
                    File Complaint
                  </Link>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link d-flex align-items-center gap-2 text-secondary" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link d-flex align-items-center gap-2 ${isActive('/login')}`} to="/login">
                    <i className="bi bi-box-arrow-in-right"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link d-flex align-items-center gap-2 ${isActive('/register')}`} to="/register">
                    <i className="bi bi-person-plus"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
