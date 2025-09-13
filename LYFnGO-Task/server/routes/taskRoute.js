const express = require('express');
const { getTasks, addTask, updateTask, deleteTask, getTaskById } = require('../controllers/taskControl');
const { authMiddleware } = require('../middleware/authMiddleware');
const Taskrouter = express.Router();

Taskrouter.get('/gettask', authMiddleware, getTasks);
Taskrouter.get("/gettasks/:id", authMiddleware, getTaskById);
Taskrouter.post('/posttask', authMiddleware, addTask);

Taskrouter.put('/updatetask/:id', authMiddleware, updateTask);
Taskrouter.delete('/deletetask/:id', authMiddleware, deleteTask);

module.exports = Taskrouter;
