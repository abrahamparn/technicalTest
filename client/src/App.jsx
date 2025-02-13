import { useState, useEffect, useRef } from "react";
import "./App.css";
import CreateTaskForm from "./components/CreateTaskForm";
import TaskList from "./components/TaskList";
import { getAllTask } from "../hooks/request";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function App() {
  // simple animation
  const mainRef = useRef(null);
  useGSAP(
    () => {
      let timeline = gsap.timeline();
      timeline.fromTo(
        mainRef.current.querySelector(".animateToRight"),
        { x: -100 },
        { x: 0, duration: 2 }
      );
      timeline.fromTo(
        mainRef.current.querySelector(".animateToLeft"),
        { x: 100 },
        { x: 0, duration: 2 },
        "<"
      );
      gsap.to(mainRef.current.querySelector(".animateToUpAndDown"), {
        repeat: -1,
        yoyo: true,
        duration: 1,
        y: -10,
      });
    },
    { scope: mainRef }
  );

  const [tasks, setTasks] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [editingTask, setEditingTask] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000);
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const response = await getAllTask();
      setTasks(response.data);
    } catch (error) {
      showAlert("danger", "Failed to fetch tasks.");
    }
  };

  return (
    <main className="container py-4" ref={mainRef}>
      <h1 className="mb-4 animateToUpAndDown">Task Management</h1>

      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="row">
        <div className="col-12 col-lg-4 mb-5 animateToRight">
          {!editingTask && (
            <CreateTaskForm showAlert={showAlert} tasks={tasks} setTasks={setTasks} />
          )}
        </div>

        <div className="col-12 col-lg-8 animateToLeft">
          <TaskList
            fetchAllTasks={fetchAllTasks}
            showAlert={showAlert}
            tasks={tasks}
            setTasks={setTasks}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
