import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    eventsRemaining: 0,
    packageInfo: null,
    companyInfo: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Different API calls based on user role
        if (user.role === 'superadmin') {
          const [packagesRes, eventsRes, companiesRes] = await Promise.all([
            axios.get('http://localhost:5000/api/packages', { withCredentials: true }),
            axios.get('http://localhost:5000/api/events', { withCredentials: true }),
            axios.get('http://localhost:5000/api/companies', { withCredentials: true })
          ]);
          
          setStats({
            totalPackages: packagesRes.data.length,
            totalEvents: eventsRes.data.length,
            totalCompanies: companiesRes.data.length,
            pendingCompanies: companiesRes.data.filter(c => !c.isActive).length
          });
        } else {
          // For company admin or data entry
          const companyId = user.company;
          const [companyRes, eventsRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/companies/${companyId}`, { withCredentials: true }),
            axios.get(`http://localhost:5000/api/events/company/${companyId}`, { withCredentials: true })
          ]);
          
          setStats({
            totalEvents: eventsRes.data.length,
            eventsRemaining: companyRes.data.eventCountRemaining,
            packageInfo: companyRes.data.activePackage,
            companyInfo: companyRes.data
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {user && user.role === 'superadmin' ? (
        // Super Admin Dashboard
        <Row>
          <Col md={3}>
            <Card className="mb-4 text-center">
              <Card.Body>
                <h3 className="display-4">{stats.totalPackages || 0}</h3>
                <Card.Title>Total Packages</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-4 text-center">
              <Card.Body>
                <h3 className="display-4">{stats.totalCompanies || 0}</h3>
                <Card.Title>Total Companies</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-4 text-center">
              <Card.Body>
                <h3 className="display-4">{stats.pendingCompanies || 0}</h3>
                <Card.Title>Pending Approvals</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-4 text-center">
              <Card.Body>
                <h3 className="display-4">{stats.totalEvents || 0}</h3>
                <Card.Title>Total Events</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        // Company Admin/Data Entry Dashboard
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Company Information</Card.Header>
              <Card.Body>
                {stats.companyInfo ? (
                  <div>
                    <h4>{stats.companyInfo.name}</h4>
                    <p><strong>Address:</strong> {stats.companyInfo.address}</p>
                    <p><strong>Contact Person:</strong> {stats.companyInfo.contactPerson}</p>
                    <p><strong>Contact Email:</strong> {stats.companyInfo.contactEmail}</p>
                    <p><strong>Contact Phone:</strong> {stats.companyInfo.contactPhone}</p>
                    <p><strong>Status:</strong> {stats.companyInfo.isActive ? 'Active' : 'Pending Approval'}</p>
                  </div>
                ) : (
                  <p>No company information available</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Package Information</Card.Header>
              <Card.Body>
                {stats.packageInfo ? (
                  <div>
                    <h4>{stats.packageInfo.name}</h4>
                    <p><strong>Description:</strong> {stats.packageInfo.description}</p>
                    <p><strong>Duration:</strong> {stats.packageInfo.duration} days</p>
                    <p><strong>Events Used:</strong> {stats.totalEvents} / {stats.packageInfo.eventLimit}</p>
                    <p><strong>Events Remaining:</strong> {stats.eventsRemaining}</p>
                    {stats.companyInfo?.packageExpiryDate && (
                      <p><strong>Expires On:</strong> {new Date(stats.companyInfo.packageExpiryDate).toLocaleDateString()}</p>
                    )}
                  </div>
                ) : (
                  <Alert variant="warning">
                    No active package. Please contact the super admin to purchase a package.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
