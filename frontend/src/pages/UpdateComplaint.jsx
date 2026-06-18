import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const UpdateComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Update states
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        if (response.data.success) {
          setComplaint(response.data.data);
          setStatus(response.data.data.status);
          setPriority(response.data.data.priority);
        }
      } catch (err) {
        setError('Complaint not found or network connection failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await api.put(`/complaints/${id}`, {
        status,
        priority,
      });

      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Complaint status updated successfully! Redirecting back...',
        });
        setTimeout(() => {
          navigate('/complaints');
        }, 1800);
      }
    } catch (err) {
      setAlert({
        show: true,
        type: 'danger',
        message: err.response?.data?.error || 'Failed to update complaint.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (val) => {
    switch (val) {
      case 'Pending': return 'text-warning';
      case 'In Progress': return 'text-info';
      case 'Resolved': return 'text-success';
      case 'Closed': return 'text-secondary';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary mt-3">Loading complaint details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5 max-width-md mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-octagon fs-1 text-danger mb-3 d-inline-block"></i>
          <h4>Unable to find complaint</h4>
          <p className="text-secondary mb-4">{error || 'The requested complaint record does not exist.'}</p>
          <Link to="/complaints" className="btn btn-premium">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4">
            <Link to="/complaints" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2 hover-text-white">
              <i className="bi bi-arrow-left"></i> Back to Dashboard
            </Link>
          </div>

          <div className="glass-card p-4 p-md-5">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 border-bottom border-secondary border-opacity-25 pb-4 mb-4">
              <div>
                <span className="text-uppercase text-secondary tracking-wider fs-7">Complaint Detail</span>
                <h3 className="fw-bold mt-1 mb-0">{complaint.title}</h3>
              </div>
              <div className="text-md-end">
                <span className="text-secondary d-block fs-7">Filed on</span>
                <span className="fw-medium">
                  {new Date(complaint.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {alert.show && (
              <div className={`alert alert-${alert.type} border-0 rounded-3 text-center mb-4`} role="alert">
                {alert.type === 'success' ? (
                  <i className="bi bi-check-circle-fill me-2"></i>
                ) : (
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                )}
                {alert.message}
              </div>
            )}

            <div className="row g-4">
              {/* Detailed description */}
              <div className="col-12">
                <h6 className="text-secondary fw-bold text-uppercase mb-2">Description</h6>
                <div className="p-3 rounded-3" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'pre-wrap' }}>
                  {complaint.description}
                </div>
              </div>

              {/* Reporter Info */}
              <div className="col-md-6">
                <h6 className="text-secondary fw-bold text-uppercase mb-2">Reporter Details</h6>
                <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-person text-secondary"></i>
                    <span className="fw-medium">{complaint.reporterName}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-envelope text-secondary"></i>
                    <span className="text-truncate">{complaint.reporterEmail}</span>
                  </div>
                </div>
              </div>

              {/* Technical properties */}
              <div className="col-md-6">
                <h6 className="text-secondary fw-bold text-uppercase mb-2">Metadata</h6>
                <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="mb-2">
                    <span className="text-secondary me-2">Category:</span>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 py-1 px-2.5 rounded">
                      {complaint.category}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-secondary me-2">Original Priority:</span>
                    <span className="fw-medium">{complaint.priority}</span>
                  </div>
                  <div>
                    <span className="text-secondary me-2">Original Status:</span>
                    <span className={`fw-medium ${getStatusClass(complaint.status)}`}>{complaint.status}</span>
                  </div>
                </div>
              </div>

              <hr className="my-4 border-secondary opacity-25" />

              {/* Update form */}
              <form onSubmit={handleUpdate} className="col-12 mt-2">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <i className="bi bi-sliders text-primary" style={{ color: 'var(--accent-purple)' }}></i> Update Status & Priority
                </h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label text-secondary fw-semibold">Complaint Status</label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="form-select form-select-premium"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label text-secondary fw-semibold">Urgency Priority</label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="form-select form-select-premium"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="col-12 mt-5">
                    <div className="d-flex gap-3">
                      <Link to="/complaints" className="btn btn-outline-secondary w-50 py-3 rounded-3">
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={updating}
                        className="btn btn-premium w-50 py-3"
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save2 me-2"></i> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateComplaint;
