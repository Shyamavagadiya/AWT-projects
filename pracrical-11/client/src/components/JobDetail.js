import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (!job) {
    return <div className="alert alert-warning mt-3">Job not found</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">{job.title}</h2>
        <h4 className="card-subtitle mb-3 text-muted">{job.company}</h4>
        
        <div className="mb-3">
          <span className="badge bg-primary me-2">{job.jobType}</span>
          <span className="badge bg-secondary me-2">{job.location}</span>
          <span className="badge bg-success">${job.salary.toLocaleString()}/year</span>
        </div>
        
        <h5>Job Description</h5>
        <p>{job.description}</p>
        
        <h5>Requirements</h5>
        <ul className="list-group mb-4">
          {job.requirements.map((req, index) => (
            <li key={index} className="list-group-item">{req}</li>
          ))}
        </ul>
        
        <p className="text-muted">Posted on: {new Date(job.postedDate).toLocaleDateString()}</p>
        
        <Link to="/" className="btn btn-primary">Back to Jobs</Link>
      </div>
    </div>
  );
};

export default JobDetail;