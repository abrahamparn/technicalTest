import React, { useState } from "react";
import { deleteTaskToServer, editTaskToServer, patchTaskToServer } from "../../hooks/request";
import "./../App.css";
const TaskList = ({ fetchAllTasks, showAlert, tasks, setTasks, editingTask, setEditingTask }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      const response = await patchTaskToServer(task.id, newStatus);

      if (response.status === 200) {
        showAlert("success", `Task status updated to ${newStatus}`);
        fetchAllTasks();
      }
    } catch (error) {
      showAlert("danger", "Failed to update task status.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await deleteTaskToServer(taskId);
      if (response.status === 200) {
        showAlert("success", "Task deleted successfully.");
        fetchAllTasks();
      }
    } catch (error) {
      showAlert("danger", "Failed to delete task.");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task.id);
    setEditFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date ? new Date(task.due_date).toLocaleDateString("en-GB") : "",
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    let inputVal = e.target.value;

    inputVal = inputVal.replace(/\D/g, "");

    if (inputVal.length > 8) {
      inputVal = inputVal.slice(0, 8);
    }

    let formatted = "";

    if (inputVal.length >= 1) {
      formatted = inputVal.substring(0, 2);
    }
    if (inputVal.length >= 3) {
      formatted += "/" + inputVal.substring(2, 4);
    }
    if (inputVal.length >= 5) {
      formatted += "/" + inputVal.substring(4, 8);
    }

    setEditFormData((prev) => ({ ...prev, due_date: formatted }));
  };

  const validateForm = () => {
    let errors = {};

    if (!editFormData.title.trim()) errors.title = "Title is required.";
    if (!editFormData.description.trim()) errors.description = "Description is required.";
    if (!editFormData.due_date.trim()) {
      errors.due_date = "Due date is required.";
    } else {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(editFormData.due_date)) {
        errors.due_date = "Due date must be in DD/MM/YYYY format.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let response = await editTaskToServer(
          editingTask,
          editFormData.title,
          editFormData.description,
          editFormData.due_date
        );

        if (response.status === 200) {
          showAlert("success", response.data.message);
          setEditFormData({ title: "", description: "", due_date: "" });
          setTasks([...tasks, { ...editFormData, status: "Pending" }]);
          fetchAllTasks();
          setEditingTask(null);
        } else {
          showAlert("danger", response.message);
        }
      } catch (error) {
        showAlert("danger", error.message);
      }
    } else {
      showAlert("danger", "Form has validation errors.");
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  let filteredTasks =
    filterStatus === "All" ? tasks : tasks.filter((task) => task.status === filterStatus);

  filteredTasks = [...filteredTasks].sort((a, b) => {
    const dateA = a.due_date ? new Date(a.due_date) : null;
    const dateB = b.due_date ? new Date(b.due_date) : null;
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page > totalPages ? totalPages : page;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  const handleSortByDate = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <p className="m-0">Current Tasks</p>
        <div>
          <button
            className={`btn ${filterStatus === "All" ? "btn-primary" : "btn-outline-primary"} mr-2`}
            onClick={() => setFilterStatus("All")}
          >
            All
          </button>
          <button
            className={`btn ${
              filterStatus === "Pending" ? "btn-primary" : "btn-outline-primary"
            } mr-2`}
            onClick={() => setFilterStatus("Pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${
              filterStatus === "Completed" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilterStatus("Completed")}
          >
            Completed
          </button>

          <button className="btn btn-info ml-2" onClick={handleSortByDate}>
            Sort by Date ({sortDirection === "asc" ? "Asc" : "Desc"})
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="thead-light">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task, id) => (
                <tr key={id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString("en-GB") : ""}
                  </td>
                  <td>
                    <span
                      className={`badge badge-${
                        task.status === "Completed" ? "success" : "secondary"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  {!editingTask && (
                    <>
                      <td>
                        <button
                          className="btn btn-sm btn-info mr-2"
                          onClick={() => handleToggleStatus(task)}
                        >
                          {task.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                        </button>
                        <button
                          className="btn btn-sm btn-warning mr-2"
                          onClick={() => handleEditClick(task)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>
          <label className="mr-2">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div>
          <button
            className="btn btn-sm btn-secondary mr-2"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-secondary ml-2"
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      {editingTask && (
        <div className="card edit-card">
          <div className="card-header">
            <h5 className="m-0">Edit Task</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  className="form-control"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                />
                {validationErrors.title && (
                  <small className="text-danger">{validationErrors.title}</small>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={3}
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                />
                {validationErrors.description && (
                  <small className="text-danger">{validationErrors.description}</small>
                )}
              </div>
              <div className="form-group">
                <label>Due Date (DD/MM/YYYY)</label>
                <input
                  id="due_date"
                  name="due_date"
                  className="form-control"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={editFormData.due_date}
                  onChange={handleDateChange}
                />
                {validationErrors.due_date && (
                  <small className="text-danger">{validationErrors.due_date}</small>
                )}
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
