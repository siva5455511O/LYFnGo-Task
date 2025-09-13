import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/NavBar";
import { DeleteTaskApi, GetTaskApi } from "../url/Api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get(GetTaskApi, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to load tasks ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DeleteTaskApi}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Task deleted ✅");
      fetchTasks();
    } catch (error) {
      toast.error("Delete failed ❌");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  // function to return colored chip
  const getStatusChip = (status) => {
    let color = "default";
    if (status === "Pending") color = "warning";
    else if (status === "In Progress") color = "info";
    else if (status === "Completed") color = "success";
    return <Chip label={status} color={color} variant="outlined" />;
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={() => navigate("/task/new")}
              sx={{ borderRadius: "8px" }}
            >
              + Add Task
            </Button>
          </Box>
        </Box>

        <Paper
          elevation={3}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task._id} hover>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{getStatusChip(task.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => navigate(`/task/edit/${task._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No tasks found 🚀
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
}

export default Dashboard;
