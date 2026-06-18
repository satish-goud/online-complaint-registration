import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ViewComplaints = () => {
  const role = localStorage.getItem('role');
  const canManage = role === 'admin' || role === 'agent';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const [complaintsRes, statsRes] = await Promise.all([
        api.get('/complaints', { params }),
        api.get('/complaints/stats'),
      ]);

      if (complaintsRes.data.success) {
        setComplaints(complaintsRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      setError('Failed to load complaints. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const handleDelete = async (id) => {
    if (role !== 'admin') return;
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await api.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete complaint');
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      c.reporterName.toLowerCase().includes(term) ||
      c.reporterEmail.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'In Progress': return 'badge-progress';
      case 'Resolved': return 'badge-resolved';
      case 'Closed': return 'badge-closed';
      default: return '';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low': return 'badge-low';
      case 'Medium': return 'badge-medium';
      case 'High': return 'badge-high';
      default: return '';
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="glass-card p-4 text-center">
            <h6 className="text-secondary fw-bold text-uppercase mb-2" style={{ fontSize: '0.8rem' }}>Total Complaints</h6>
            <h2 className="display-6 fw-bold mb-0 text-white">{stats.total}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 text-center border-warning border-opacity-25" style={{ background: 'rgba(234, 179, 8, 0.05)' }}>
            <h6 className="text-warning fw-bold text-uppercase mb-2" style={{ fontSize: '0.8rem' }}>Pending</h6>
            <h2 className="display-6 fw-bold mb-0 text-warning">{stats.pending}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 text-center border-info border-opacity-25" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
            <h6 className="text-info fw-bold text-uppercase mb-2" style={{ fontSize: '0.8rem' }}>In Progress</h6>
            <h2 className="display-6 fw-bold mb-0 text-info">{stats.progress}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 text-center border-success border-opacity-25" style={{ background: 'rgba(34, 197, 94, 0.05)' }}>
            <h6 className="text-success fw-bold text-uppercase mb-2" style={{ fontSize: '0.8rem' }}>Resolved</h6>
            <h2 className="display-6 fw-bold mb-0 text-success">{stats.resolved}</h2>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="row g-3">
          <div className="col-lg-4 col-md-12">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-premium border-start-0 ps-0"
                placeholder="Search by title, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select form-select-premium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select form-select-premium"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Security">Security</option>
              <option value="Facility">Facility</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-12">
            <button type="button" className="btn btn-premium w-100 h-100" onClick={fetchComplaints}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary mt-3">Fetching complaints database...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger">
            <i className="bi bi-exclamation-octagon fs-1 mb-3"></i>
            <h5>Error</h5>
            <p className="mb-0">{error}</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-secondary mb-3 d-inline-block"></i>
            <h5>No Complaints Found</h5>
            <p className="text-secondary mb-0">No records match the current filters or search terms.</p>
            <Link to="/submit" className="btn btn-premium mt-3">
              <i className="bi bi-plus-circle me-2"></i>File New Complaint
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="border-secondary border-opacity-25" style={{ color: 'var(--text-secondary)' }}>
                  <th scope="col" className="ps-3">Complaint</th>
                  <th scope="col">Category</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reporter</th>
                  <th scope="col">Date Filed</th>
                  <th scope="col" className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id} className="border-secondary border-opacity-25">
                    <td className="ps-3 py-3">
                      <div className="fw-semibold text-white">{complaint.title}</div>
                      <small className="text-secondary d-inline-block text-truncate" style={{ maxWidth: '250px' }}>
                        {complaint.description}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 py-1 px-2.5 rounded">
                        {complaint.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-priority ${getPriorityBadge(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${getStatusBadge(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <div>{complaint.reporterName}</div>
                      <small className="text-secondary">{complaint.reporterEmail}</small>
                    </td>
                    <td>
                      {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="text-end pe-3">
                      {canManage && (
                        <>
                          <Link to={`/update/${complaint._id}`} className="btn btn-sm btn-outline-light border-secondary border-opacity-50 py-1.5 px-3 rounded-3 me-1">
                            <i className="bi bi-pencil-square me-1"></i> Update
                          </Link>
                          {role === 'admin' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger py-1.5 px-3 rounded-3"
                              onClick={() => handleDelete(complaint._id)}
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewComplaints;
