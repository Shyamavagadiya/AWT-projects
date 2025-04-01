import React from 'react';
import './StudentList.css';

const StudentList = ({ students }) => {
  return (
    <table className="student-list">
      <thead>
        <tr>
          <th>Name</th>
          <th>Marks</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td>{student.name}</td>
            <td>{student.marks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;