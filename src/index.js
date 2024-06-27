// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Example initial tasks data (replace with database in real application)
let tasks = [
    { id: 1, title: 'Task 1', description: 'Description for Task 1', dueDate: '2024-06-30' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2', dueDate: '2024-07-01' }
];
let nextTaskId = 3; // Next ID to assign for new tasks

// Middleware
app.use(cors()); // Allow Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
// GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: `Task with ID ${id} not found` });
    }
});

// POST create a new task
app.post('/api/tasks', (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title || !description || !dueDate) {
        return res.status(400).json({ error: 'Title, description, and due date are required' });
    }
    const newTask = { id: nextTaskId++, title, description, dueDate };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT update an existing task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, dueDate } = req.body;
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    taskToUpdate.title = title;
    taskToUpdate.description = description;
    taskToUpdate.dueDate = dueDate;
    res.json(taskToUpdate);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    tasks.splice(index, 1);
    res.status(204).send(); // No content returned after successful deletion
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
