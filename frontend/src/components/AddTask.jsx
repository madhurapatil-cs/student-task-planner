import { useState } from "react";
import API from "../services/api";

function AddTask({ onTaskAdded, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Study",
    priority: "Medium",
    dueDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      setError("Title and Due Date are required.");
      return;
    }

    try {
      setError("");

      const response = await API.post("/tasks", formData);

      onTaskAdded(response.data.data);

      setFormData({
        title: "",
        description: "",
        category: "Study",
        priority: "Medium",
        dueDate: "",
      });

      onClose();
    } catch (error) {
      console.error("Error adding task:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add task. Please try again."
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="task-form">

        <div className="form-header">
          <h2>Add New Task</h2>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Task Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
          />

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Study">Study</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>

          <label>Priority</label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label>Due Date</label>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Add Task
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTask;