import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ViewComplaints from './pages/ViewComplaints';
import SubmitComplaint from './pages/SubmitComplaint';
import UpdateComplaint from './pages/UpdateComplaint';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <ViewComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update/:id"
            element={
              <ProtectedRoute roles={['admin', 'agent']}>
                <UpdateComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="py-4 text-center mt-auto border-top border-secondary border-opacity-25" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <small className="text-secondary">© 2026 ResolveGrid Online Complaint Registration System. All rights reserved.</small>
        </div>
      </footer>
    </Router>
  );
}

export default App;
