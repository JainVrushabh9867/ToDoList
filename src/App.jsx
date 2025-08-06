import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [val, setVal] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    if (savedTasks) setTasks(savedTasks);
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val.trim() === '') return;

    const newTask = {
      text: val,
      completed: false,
      due: dueDate,
      priority
    };

    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = newTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    setVal('');
    setDueDate('');
    setPriority('Medium');
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEdit = (index) => {
    const task = tasks[index];
    setVal(task.text);
    setDueDate(task.due || '');
    setPriority(task.priority || 'Medium');
    setEditingIndex(index);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'active' && task.completed) return false;
    if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <h1>📋 ToDo List</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
        <button type="submit">{editingIndex !== null ? 'Update' : 'Add'}</button>
      </form>

      <input
        className="search-input"
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${(completedTasks / tasks.length) * 100 || 0}%`
          }}
        />
      </div>
      <p>✅ Completed: {completedTasks} / {tasks.length}</p>

      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <li key={index} className={`task ${task.completed ? 'completed' : ''}`}>
            <div onClick={() => toggleComplete(index)}>
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span className="task-text">{task.text}</span>
              {task.due && <small>🕓 Due: {task.due}</small>}
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(index)}>✏️</button>
              <button onClick={() => handleDelete(index)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
