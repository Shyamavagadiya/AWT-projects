import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Task Manager</h1>
        <p className="app-subtitle">Manage your tasks with MongoDB, Express, React, and Node.js</p>
      </div>

      <div className="main-content">
        <TaskForm fetchTasks={fetchTasks} />
        
        <div>
          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <TaskList tasks={tasks} fetchTasks={fetchTasks} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
