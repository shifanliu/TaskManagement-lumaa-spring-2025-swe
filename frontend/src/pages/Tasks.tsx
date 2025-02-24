import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

// Define Task type
interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // Fetch task list
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        alert("Unauthorized, please login again.");
        navigate("/");
      }
    };
    fetchTasks();
  }, [navigate]);

  // Create a new task
  const createTask = async () => {
    try {
      const response = await api.post("/tasks", { title });
      setTasks([...tasks, response.data]);
      setTitle("");
    } catch (error) {
      alert("Failed to create task.");
    }
  };

  // Update task (edit title or mark as complete)
  const updateTask = async (id: number, newTitle: string, isComplete: boolean) => {
    try {
      const response = await api.put(`/tasks/${id}`, { title: newTitle, isComplete });
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
    } catch (error) {
      alert("Failed to update task.");
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      alert("Failed to delete task.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Task Manager</h2>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <div className="input-group">
        <input
          type="text"
          placeholder="New Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div>
              <input
                type="checkbox"
                checked={task.isComplete}
                onChange={() => updateTask(task.id, task.title, !task.isComplete)}
              />
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateTask(task.id, e.target.value, task.isComplete)}
              />
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
