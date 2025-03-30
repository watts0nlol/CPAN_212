// server.js (Main Server File)
const express = require('express');
const cors = require('cors');
const mongoose = require('./db');
const recipeRoutes = require('./routes/recipes_router');

const app = express();
const PORT = 8001;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/', recipeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

