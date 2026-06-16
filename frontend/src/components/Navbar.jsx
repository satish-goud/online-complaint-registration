import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active font-weight-bold text-white' : 'text-secondary';
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
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-2 ${isActive('/')}`} to="/">
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
