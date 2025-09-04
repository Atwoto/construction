// Simple test to verify backend routes
const express = require('express');
const serverless = require('serverless-http');

// Import the backend app
const backendApp = require('../backend/src/server.js');

// Create an express app
const app = express();

// Use the backend app
app.use(backendApp);

// Export the serverless function
module.exports = app;
module.exports.handler = serverless(app);