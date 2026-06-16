import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    priority: 'Medium',
    reporterName: '',
    reporterEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/complaints', formData);
      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Your complaint has been successfully registered! Redirecting to Dashboard...',
        });
        setFormData({
          title: '',
          description: '',
          category: 'Technical',
          priority: 'Medium',
          reporterName: '',
          reporterEmail: '',
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit complaint. Please check the network.';
      setAlert({
        show: true,
        type: 'danger',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card p-4 p-md-5">
            <div className="text-center mb-5">
              <i className="bi bi-pencil-square fs-1 text-primary mb-3 d-inline-block" style={{ color: 'var(--accent-purple)' }}></i>
              <h2 className="fw-bold">File a Complaint</h2>
              <p className="text-secondary">Please fill in the form below. We will review and act on it promptly.</p>
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

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-12">
                  <label htmlFor="title" className="form-label text-secondary fw-semibold">Complaint Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control form-control-premium"
                    placeholder="Brief summary of the issue (e.g. Server is down, Billing mismatch)"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="category" className="form-label text-secondary fw-semibold">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select form-select-premium"
                    required
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Security">Security</option>
                    <option value="Facility">Facility</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="priority" className="form-label text-secondary fw-semibold">Priority Level</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select form-select-premium"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="col-12">
                  <label htmlFor="description" className="form-label text-secondary fw-semibold">Description of the Complaint</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control form-control-premium"
                    placeholder="Provide details about your complaint so we can resolve it quickly..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <hr className="my-4 border-secondary opacity-25" />

                <div className="col-md-6">
                  <label htmlFor="reporterName" className="form-label text-secondary fw-semibold">Your Full Name</label>
                  <input
                    type="text"
                    id="reporterName"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleChange}
                    className="form-control form-control-premium"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="reporterEmail" className="form-label text-secondary fw-semibold">Your Email Address</label>
                  <input
                    type="email"
                    id="reporterEmail"
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={handleChange}
                    className="form-control form-control-premium"
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>

                <div className="col-12 mt-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-premium w-100 py-3 fs-5"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i> Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
