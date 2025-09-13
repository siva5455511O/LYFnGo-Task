import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import TaskTable from "./components/TaskTable";
import TaskForm from "./components/TaskForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/new"
          element={
            <ProtectedRoute>
              <TaskForm/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/edit/:id"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
