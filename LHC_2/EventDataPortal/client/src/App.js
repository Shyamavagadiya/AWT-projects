import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Basic Pages
import BasicLogin from './pages/BasicLogin';
import BasicRegister from './pages/BasicRegister';
import BasicSuperAdminDashboard from './pages/BasicSuperAdminDashboard';
import BasicCompanyDashboard from './pages/BasicCompanyDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<BasicLogin onLogin={handleLogin} />} />
              <Route path="/register" element={<BasicRegister />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : user.role === 'superadmin' ? (
            <Route path="*" element={<BasicSuperAdminDashboard user={user} onLogout={handleLogout} />} />
          ) : (
            <Route path="*" element={<BasicCompanyDashboard user={user} onLogout={handleLogout} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
