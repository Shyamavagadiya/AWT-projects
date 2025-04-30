import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title) {
      alert('Please add a title');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        title,
        description,
        completed: false
      });
      
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-task">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter task title"
          />
        </div>
        <div className="form-control">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter task description"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-block">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;