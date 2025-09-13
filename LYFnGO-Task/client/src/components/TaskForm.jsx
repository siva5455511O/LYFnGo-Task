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

// import the endpoints you already have
import {
  GetTaskApi,
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

  // helper to get token + headers
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    const fetchTask = async () => {
      if (!isEdit) return;
      setLoading(true);

      // candidate GET URLs (tries common shapes)
      const candidates = [
        ...(GetTaskByIdApi ? [`${GetTaskByIdApi}/${id}`] : []),
        ...(GetTaskApi ? [`${GetTaskApi}/${id}`] : []),
        `${GetTaskApi}/gettask/${id}`,
        `${GetTaskApi}?id=${id}`,
        `${GetTaskApi}/${id}/get`,
        `${GetTaskApi}/${id}/`,
      ];

      let res = null;
      for (const url of candidates) {
        if (!url) continue;
        try {
          console.log("[TaskForm] trying GET", url);
          res = await axios.get(url, getAuthHeaders());
          console.log("[TaskForm] GET success from", url, res.data);
          break;
        } catch (err) {
          console.warn(
            "[TaskForm] GET failed for",
            url,
            err?.response?.status,
            err?.response?.data || err.message
          );
        }
      }

      if (!res) {
        toast.error("Failed to load task — check console (GET attempts).");
        setLoading(false);
        return;
      }

      let taskData = res.data;
      if (taskData?.task) taskData = taskData.task;
      if (Array.isArray(taskData)) taskData = taskData[0] || {};

      setTask({
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || "Pending",
      });

      setLoading(false);
    };

    fetchTask();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const headers = getAuthHeaders();

    try {
      if (isEdit) {
        const updateCandidates = [
          `${UpdateTaskApi}/${id}`,
          `${UpdateTaskApi}/updatetask/${id}`,
          `${UpdateTaskApi}/updatetask`,
          `${UpdateTaskApi}/update/${id}`,
        ];

        let updated = false;
        for (const url of updateCandidates) {
          try {
            console.log("[TaskForm] trying PUT", url);
            const body =
              url.endsWith("/updatetask") && !url.endsWith(`/${id}`)
                ? { ...task, id }
                : task;
            const res = await axios.put(url, body, headers);
            console.log("[TaskForm] PUT success from", url, res.data);
            updated = true;
            break;
          } catch (err) {
            console.warn(
              "[TaskForm] PUT failed for",
              url,
              err?.response?.status,
              err?.response?.data || err.message
            );
          }
        }

        if (!updated) {
          toast.error("Update failed — see console for attempted URLs.");
          setLoading(false);
          return;
        }

        toast.success("Task updated ✅");
      } else {
        const postCandidates = [
          PostTaskApi,
          `${GetTaskApi}`,
          `${GetTaskApi}/posttask`,
          `${UpdateTaskApi}/posttask`,
        ];

        let created = false;
        for (const url of postCandidates) {
          if (!url) continue;
          try {
            console.log("[TaskForm] trying POST", url);
            const res = await axios.post(url, task, headers);
            console.log("[TaskForm] POST success from", url, res.data);
            created = true;
            break;
          } catch (err) {
            console.warn(
              "[TaskForm] POST failed for",
              url,
              err?.response?.status
            );
          }
        }

        if (!created) {
          toast.error("Create failed — see console for attempted URLs.");
          setLoading(false);
          return;
        }

        toast.success("Task created 🎉");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Save task final error:", err?.response || err.message);
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
            {isEdit ? "✏️ Edit Task" : "🆕 New Task"}
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
