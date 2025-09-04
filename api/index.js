const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Import the backend app
const backendApp = require('../backend/src/server.js');

// Create a new express app for Vercel
const app = express();

// Add CORS middleware
app.use(cors());

// Use the backend app directly (no prefix since it's handled in the backend)
app.use(backendApp);

// Export the serverless function
module.exports = app;
module.exports.handler = serverless(app);