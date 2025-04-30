import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${id}`, {
        completed: !completed
      });
      
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, completed: res.data.completed } : task
      ));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found. Add some tasks!</p>
      ) : (
        tasks.map(task => (
          <TaskItem 
            key={task._id} 
            task={task} 
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;