// Simple test function to check if serverless functions are working
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint is working!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

module.exports = serverless(app);