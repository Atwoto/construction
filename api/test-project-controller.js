const express = require('express');
const serverless = require('serverless-http');
const projectController = require('../backend/src/controllers/projectController');

const app = express();

// Mock the request and response objects for testing
app.get('/test-project-controller', async (req, res) => {
  try {
    // Create mock request and response objects
    const mockReq = {
      query: {},
      params: {},
      body: {},
      user: { id: 1, role: 'admin' }
    };
    
    const mockRes = {
      json: function(data) {
        return res.status(200).json({
          success: true,
          data: data,
          test: 'Project controller test successful'
        });
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      }
    };
    
    // Test the getProjectStats method directly
    await projectController.getProjectStats(mockReq, mockRes);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = app;
module.exports.handler = serverless(app);