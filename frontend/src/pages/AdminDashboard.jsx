import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get('/complaints');
        setComplaints(response.data.data);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  const adminName = localStorage.getItem('name') || 'Admin';

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Admin Dashboard</h2>
        <div className="d-flex gap-2">
          <Link to="/complaints" className="btn btn-outline-light btn-sm">
            View Complaints
          </Link>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="glass-card p-4 text-center">
                <h6 className="text-secondary text-uppercase mb-2">Total Complaints</h6>
                <h2 className="display-6 fw-bold mb-0">{complaints.length}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="glass-card p-4 text-center">
                <h6 className="text-warning text-uppercase mb-2">Pending</h6>
                <h2 className="display-6 fw-bold mb-0 text-warning">
                  {complaints.filter((c) => c.status === 'Pending').length}
                </h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="glass-card p-4 text-center">
                <h6 className="text-info text-uppercase mb-2">In Progress</h6>
                <h2 className="display-6 fw-bold mb-0 text-info">
                  {complaints.filter((c) => c.status === 'In Progress').length}
                </h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="glass-card p-4 text-center">
                <h6 className="text-success text-uppercase mb-2">Resolved</h6>
                <h2 className="display-6 fw-bold mb-0 text-success">
                  {complaints.filter((c) => c.status === 'Resolved').length}
                </h2>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="fw-bold">Welcome, {adminName}</h3>
            <p className="text-secondary mb-0">
              Use the dashboard to view complaints, update statuses, and monitor the system.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
