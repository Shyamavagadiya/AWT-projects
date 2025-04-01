import React, { useState } from 'react';
import './StudentForm.css';

const StudentForm = ({ addStudent }) => {
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter a student name.');
      return;
    }
    if (!marks || marks < 0 || marks > 100) {
      setError('Please enter valid marks (0-100).');
      return;
    }
    setError('');
    addStudent({ name, marks: parseInt(marks) });
    setName('');
    setMarks('');
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-group">
        <label>Student Name:</label>
        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Marks:</label>
        <input
          type="number"
          placeholder="Enter marks (0-100)"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentForm;