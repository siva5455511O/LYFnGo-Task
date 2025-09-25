import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  GetTaskByIdApi,
  PostTaskApi,
  UpdateTaskApi,
} from "../url/Api";
import Navbar from "./NavBar";

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });


  useEffect(() => {
    const fetchTask = async () => {
      if (!isEdit) return;
      setLoading(true);

      try {
        const res = await axios.get(`${GetTaskByIdApi}/${id}`, getAuthHeaders());
        const taskData = res.data.task || res.data;

        setTask({
          title: taskData.title || "",
          description: taskData.description || "",
          status: taskData.status || "Pending",
        });
      } catch (err) {
        console.error("Fetch task error:", err?.response || err.message);
        toast.error("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setTask({ ...task, [e.target.name]: e.target.value });

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        // Update Task
        await axios.put(`${UpdateTaskApi}/${id}`, task, getAuthHeaders());
        toast.success("Task updated successfully");
      } else {
        // Create Task
        await axios.post(PostTaskApi, task, getAuthHeaders());
        toast.success("Task created successfully");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Save task error:", err?.response || err.message);
      toast.error(err?.response?.data?.msg || "Error saving task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: "20px",
            background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            textAlign="center"
            color="primary"
          >
            {isEdit ? "Edit Task" : "New Task"}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                margin="normal"
                value={task.title}
                onChange={handleChange}
                required
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                value={task.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
              <TextField
                select
                label="Status"
                name="status"
                fullWidth
                margin="normal"
                value={task.status}
                onChange={handleChange}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                  },
                }}
              >
                {isEdit ? "Update Task" : "Create Task"}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default TaskForm;
