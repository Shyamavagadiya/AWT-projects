import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import './App.css';

const App = () => {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const calculateAverage = () => {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, student) => sum + student.marks, 0);
    return (total / students.length).toFixed(2);
  };

  return (
    <div className="App">
      <h1>Student Result Management</h1>
      <StudentForm addStudent={addStudent} />
      <StudentList students={students} />
      <div className="average-marks">
        <strong>Average Marks:</strong> {calculateAverage()}
      </div>
    </div>
  );
};

export default App;