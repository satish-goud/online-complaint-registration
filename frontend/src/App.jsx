import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ViewComplaints from './pages/ViewComplaints';
import SubmitComplaint from './pages/SubmitComplaint';
import UpdateComplaint from './pages/UpdateComplaint';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<ViewComplaints />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/update/:id" element={<UpdateComplaint />} />
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
