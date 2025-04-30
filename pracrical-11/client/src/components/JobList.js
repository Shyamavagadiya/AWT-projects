import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search filters
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    try {
      let queryString = Object.keys(filters)
        .filter(key => filters[key])
        .map(key => `${key}=${encodeURIComponent(filters[key])}`)
        .join('&');
      
      const url = `http://localhost:5000/api/jobs${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {
      title,
      location,
      jobType,
      minSalary,
      maxSalary
    };
    fetchJobs(filters);
  };

  const clearFilters = () => {
    setTitle('');
    setLocation('');
    setJobType('');
    setMinSalary('');
    setMaxSalary('');
    fetchJobs();
  };

  return (
    <div>
      <h2 className="mb-4">Find Your Dream Job</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Search Jobs</h5>
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Salary"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Salary"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <button type="submit" className="btn btn-primary me-2">Search</button>
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="row">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <div className="col-md-6 mb-4" key={job._id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{job.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                      <p className="card-text">
                        <strong>Location:</strong> {job.location}<br />
                        <strong>Job Type:</strong> {job.jobType}<br />
                        <strong>Salary:</strong> ${job.salary.toLocaleString()}/year
                      </p>
                      <Link to={`/job/${job._id}`} className="btn btn-primary">View Details</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">No jobs found matching your criteria.</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;