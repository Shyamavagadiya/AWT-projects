import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CompanyApprovals = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();

  // Fetch pending companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/companies', {
        withCredentials: true
      });
      
      // Filter only pending companies
      const pendingCompanies = res.data.filter(company => !company.isActive);
      setCompanies(pendingCompanies);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch companies');
      setLoading(false);
    }
  };

  // Handle company approval
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/companies/${id}/approve`, {}, {
        withCredentials: true
      });
      
      setSuccess('Company approved successfully');
      fetchCompanies(); // Refresh list
    } catch (err) {
      setError('Failed to approve company');
    }
  };

  // Check if user is super admin
  if (user && user.role !== 'superadmin') {
    return (
      <Alert variant="danger">
        You do not have permission to access this page.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Pending Company Approvals</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card>
        <Card.Header>Companies Pending Approval</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : companies.length === 0 ? (
            <p className="text-center">No pending company approvals</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Contact Person</th>
                  <th>Contact Email</th>
                  <th>Contact Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company._id}>
                    <td>{company.name}</td>
                    <td>{company.contactPerson}</td>
                    <td>{company.contactEmail}</td>
                    <td>{company.contactPhone}</td>
                    <td>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove(company._id)}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      <Card className="mt-4">
        <Card.Header>How to Test Company Approval</Card.Header>
        <Card.Body>
          <ol>
            <li>First, register a company using the registration form</li>
            <li>Login as a super admin</li>
            <li>Navigate to this approvals page</li>
            <li>You'll see the pending company in the table above</li>
            <li>Click the "Approve" button to approve the company</li>
            <li>After approval, the company admin can login with their credentials</li>
          </ol>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CompanyApprovals;
