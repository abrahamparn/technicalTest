import axios from "axios";

const devBaseUrl = "http://localhost:3000/api/tasks";
const prodBaseUrl = "/api/tasks";
const baseUrl = process.env.NODE_ENV === "development" ? devBaseUrl : prodBaseUrl;

const sendTaskToServer = async (newTask) => {
  try {
    const response = await axios.post(baseUrl, newTask);

    if (response.status === 201) {
      return { status: "success", message: response.data.message, id: response.data.id };
    } else {
      return { status: "error", message: response.data.message };
    }
  } catch (error) {
    console.error("Error Response:", error.response);

    return {
      status: "danger",
      message: error.response?.data?.message || error.message || "An unknown error occurred",
      errors: error.response?.data?.errors || null,
    };
  }
};

const patchTaskToServer = async (id, status) => {
  const response = await axios.patch(`${baseUrl}/${id}`, {
    status: status,
  });
  return response;
};

const deleteTaskToServer = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response;
};

const editTaskToServer = async (id, title, description, due_date) => {
  let response = await axios.put(`${baseUrl}/${id}`, {
    title,
    description,
    due_date,
  });
  return response;
};

const getAllTask = async () => {
  const response = await axios.get(baseUrl);
  return response;
};
export { sendTaskToServer, patchTaskToServer, deleteTaskToServer, editTaskToServer, getAllTask };
