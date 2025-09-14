import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginApi } from "../url/Api";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(LoginApi, data);

      // ✅ store JWT token in localStorage
      localStorage.setItem("token", res.data.token);

      toast.success(res.data.msg || "Login successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      // redirect to dashboard
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={5}
        sx={{
          p: 5,
          borderRadius: "20px",
          background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "primary.main",
          }}
        >
           Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.4,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "12px",
              textTransform: "none",
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0, #1e88e5)",
              },
            }}
          >
            Login
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 3 }}>
          Don&apos;t have an account?{" "}
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate("/signup")}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
