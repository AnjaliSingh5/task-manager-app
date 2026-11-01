import { useEffect, useState } from "react";
import api from "../api";
import TaskForm from "./TaskForm";
import { useAuth } from "../context/AuthContext";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    const { data } = await api.post("/tasks", task);
    setTasks((prev) => [data, ...prev]);
  };

  const toggleComplete = async (task) => {
    const { data } = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="task-page">
      <header className="task-header">
        <h1>My Tasks</h1>
        <div>
          <span>Hi, {user?.name}</span>
          <button onClick={logout}>Log Out</button>
        </div>
      </header>

      <TaskForm onAdd={addTask} />

      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <span className="task-title">{task.title}</span>
            </label>
            {task.description && <p className="task-desc">{task.description}</p>}
            {task.dueDate && (
              <p className="task-due">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
        {!loading && tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
      </ul>
    </div>
  );
}
