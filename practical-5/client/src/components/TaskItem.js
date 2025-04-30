import React from 'react';

const TaskItem = ({ task, deleteTask, toggleComplete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p className="date">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="task-actions">
        {!task.completed && (
          <button 
            className="btn btn-complete"
            onClick={() => toggleComplete(task._id, task.completed)}
          >
            Mark Complete
          </button>
        )}
        <button className="btn btn-delete" onClick={() => deleteTask(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;