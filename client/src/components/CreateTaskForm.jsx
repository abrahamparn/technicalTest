import React from "react";
import { useState } from "react";
import { sendTaskToServer } from "../../hooks/request";

const CreateTaskForm = ({ showAlert, tasks, setTasks }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleClearForm = () => {
    setNewTask({
      title: "",
      description: "",
      due_date: "",
    });
    setValidationErrors({});
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

    setNewTask({ ...newTask, due_date: formatted });
  };

  const validateForm = () => {
    let errors = {};

    if (!newTask.title.trim()) errors.title = "Title is required.";
    if (!newTask.description.trim()) errors.description = "Description is required.";
    if (!newTask.due_date.trim()) {
      errors.due_date = "Due date is required.";
    } else {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(newTask.due_date)) {
        errors.due_date = "Due date must be in DD/MM/YYYY format.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let response = await sendTaskToServer(newTask);
      if (response.status === "success") {
        showAlert(response.status, response.message);
        setNewTask({ title: "", description: "", due_date: "" });
        setTasks([...tasks, { ...newTask, status: "Pending", id: response.id }]);
      } else {
        showAlert(response.status, response.message);
      }
    } else {
      showAlert("danger", "Form has validation errors.");
    }
  };

  return (
    <div className="card">
      <div className="card-header">Add New Task</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className="form-control"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            {validationErrors.title && (
              <small className="text-danger">{validationErrors.title}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <small className="text-danger">{validationErrors.description}</small>
          </div>
          <div className="form-group">
            <label htmlFor="due_date">Due Date (DD/MM/YYYY)</label>
            <input
              id="due_date"
              name="due_date"
              className="form-control"
              type="text"
              placeholder="DD/MM/YYYY"
              value={newTask.due_date}
              onChange={handleDateChange}
            />
            {validationErrors.due_date && (
              <small className="text-danger">{validationErrors.due_date}</small>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
            <button type="button" className="btn btn-danger" onClick={handleClearForm}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
