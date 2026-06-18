import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      navigate(role === 'admin' ? '/admin' : '/complaints', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      <div className="glass-card p-5 mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="fw-bold mb-3">Online Complaint Registration System</h1>
        <p className="text-secondary mb-4">
          Register, track, and manage complaints securely.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/login" className="btn btn-premium px-4">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-light px-4">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
