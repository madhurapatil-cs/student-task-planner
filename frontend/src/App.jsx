import { useEffect, useState } from "react";
import "./App.css";
import API from "./services/api";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Task modal
  const [showAddTask, setShowAddTask] = useState(false);

  // Edit Task
  const [editingTask, setEditingTask] = useState(null);

  // Search and filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");

  // Fetch tasks whenever search/filter/sorting changes
  useEffect(() => {
    fetchTasks();
  }, [
    search,
    category,
    priority,
    status,
    sortBy,
    order,
  ]);

  // FETCH TASKS

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const params = {};

      // Search
      if (search.trim() !== "") {
        params.search = search;
      }

      // Category
      if (category !== "") {
        params.category = category;
      }

      // Priority
      if (priority !== "") {
        params.priority = priority;
      }

      // Status
      if (status !== "") {
        params.status = status;
      }

      // Sorting
      if (sortBy !== "") {
        params.sortBy = sortBy;
      }

      // Order
      if (order !== "") {
        params.order = order;
      }

      const response = await API.get("/tasks", {
        params: params,
      });

      console.log(
        "FILTERED & SORTED API RESPONSE:",
        response.data
      );

      setTasks(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // DASHBOARD COUNTS

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.isCompleted === true
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.isCompleted === false
  ).length;

  // ADD TASK

  const handleTaskAdded = () => {
    setShowAddTask(false);

    // Refresh tasks
    fetchTasks();
  };

  // COMPLETE / UNCOMPLETE 

  const handleCompleteTask = async (task) => {
    try {
      console.log(
        "Completing task:",
        task._id
      );

      const response = await API.put(
        `/tasks/${task._id}`,
        {
          isCompleted: !task.isCompleted,
        }
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      // Refresh list
      fetchTasks();
    } catch (error) {
      console.error(
        "Complete Task Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update task. Please try again."
      );
    }
  };

  // DELETE TASK 

  const handleDeleteTask = async (task) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log(
        "Deleting task:",
        task._id
      );

      const response = await API.delete(
        `/tasks/${task._id}`
      );

      console.log(
        "DELETE RESPONSE:",
        response.data
      );

      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error(
        "Delete Task Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete task. Please try again."
      );
    }
  };

  // UPDATE TASK 

  const handleTaskUpdated = () => {
    setEditingTask(null);

    // Refresh list
    fetchTasks();
  };

  // CLEAR FILTERS 

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPriority("");
    setStatus("");
    setSortBy("");
    setOrder("");
  };

  // ========= UI ===========

  return (
    <div className="app">

      {/* ======= HEADER ======= */}

      <header className="header">

        <div>
          <h1>Student Task Planner</h1>

          <p>
            Manage your study tasks and academic
            responsibilities
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() =>
            setShowAddTask(true)
          }
        >
          + Add Task
        </button>

      </header>

      {/* =========== DASHBOARD =========== */}

      <section className="dashboard">

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

      </section>

      {/* ========== TASK SECTION ========== */}

      <section className="task-section">

        <div className="section-header">

          <h2>My Tasks</h2>

          <div className="filters">

            {/* ================= SEARCH ================= */}

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {/* ================= CATEGORY ================= */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="">
                All Categories
              </option>

              <option value="Study">
                Study
              </option>

              <option value="Assignment">
                Assignment
              </option>

              <option value="Exam">
                Exam
              </option>

              <option value="Personal">
                Personal
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* ================= PRIORITY ================= */}

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value="">
                All Priorities
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>

            {/* ================= STATUS ================= */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

            {/* ================= SORTING ================= */}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="" disabled>
                Sorting
              </option>

              <option value="createdAt">
                Created Date
              </option>

              <option value="dueDate">
                Due Date
              </option>

              <option value="priority">
                Priority
              </option>
            </select>

            {/* ================= ORDER ================= */}

            <select
              value={order}
              onChange={(e) =>
                setOrder(e.target.value)
              }
            >
              <option value="" disabled>
                Order
              </option>

              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>

            {/* ================= CLEAR ================= */}

            <button
              className="clear-btn"
              onClick={clearFilters}
            >
              Clear
            </button>

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="loading-state">

            <div className="spinner"></div>

            <p>
              Loading tasks...
            </p>

          </div>

        ) : tasks.length === 0 ? (

          /* ================= EMPTY STATE ================= */

          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No Tasks Found
            </h3>

            <p>
              You don't have any tasks matching
              your current filters.
            </p>

            <button
              className="empty-add-btn"
              onClick={() =>
                setShowAddTask(true)
              }
            >
              + Add Your First Task
            </button>

          </div>

        ) : (

          /* ================= TASK LIST ================= */

          tasks.map((task) => (

            <div
              className="task-card"
              key={task._id}
            >

              <div>

                {/* ================= CATEGORY ================= */}

                <span className="category">
                  {task.category}
                </span>

                {/* ================= PRIORITY ================= */}

                <span
                  className={`priority ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>

                {/* ================= TITLE ================= */}

                <h3
                  className={
                    task.isCompleted
                      ? "completed-title"
                      : ""
                  }
                >
                  {task.title}
                </h3>

                {/* ================= DESCRIPTION ================= */}

                <p>
                  {task.description}
                </p>

                {/* ================= DUE DATE ================= */}

                <small>
                  Due:{" "}
                  {new Date(
                    task.dueDate
                  ).toLocaleDateString("en-GB")}
                </small>

              </div>

              {/* ================= ACTIONS ================= */}

              <div className="task-actions">

                {/* Complete */}

                <button
                  className="complete-btn"
                  onClick={() =>
                    handleCompleteTask(task)
                  }
                >
                  {task.isCompleted
                    ? "Completed"
                    : "Complete"}
                </button>

                {/* Edit */}

                <button
                  className="edit-btn"
                  onClick={() =>
                    setEditingTask(task)
                  }
                >
                  Edit
                </button>

                {/* Delete */}

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteTask(task)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </section>

      {/* ================= ADD TASK MODAL ================= */}

      {showAddTask && (
        <AddTask
          onTaskAdded={handleTaskAdded}
          onClose={() =>
            setShowAddTask(false)
          }
        />
      )}

      {/* ================= EDIT TASK MODAL ================= */}

      {editingTask && (
        <EditTask
          task={editingTask}
          onTaskUpdated={handleTaskUpdated}
          onClose={() =>
            setEditingTask(null)
          }
        />
      )}

    </div>
  );
}

export default App;