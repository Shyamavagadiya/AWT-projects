import React, { useState } from "react";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("My Todo");
  const handleAdd = () => {
    console.log("button cliced");
    setTodos([
      ...todos,
      { id: todos.length + 1, title: title, isCompleted: true },
    ]);
    setTitle("");
  };
  const handleCompleteToggle = (id) => {
    const newList = todos.map((todo) =>
      todo.id == id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newList);
  };
  return (
    <>
      {/* add todo  */}
      <div>
        <input
          type="text"
          placeholder="Enter todo"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input type="button" value="Add" onClick={handleAdd} />
      </div>
      {/* display todo */}
      {todos.map((todo) => (
        <div key ={todo.id}>
          <input
            type="checkbox"
            name="isCompleted"
            onChange={(e) => handleCompleteToggle(todo.id)}
            checked={todo.isCompleted}
          />
          {todo.title}
          <input type="button" name="btnEdit" value="edit" />
          <input type="button" name="btnDelete" value="delete" />
        </div>
      ))}
    </>
  );
};

export default Todo;
