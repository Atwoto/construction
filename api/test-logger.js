const express = require('express');
const serverless = require('serverless-http');
const logger = require('../backend/src/utils/logger');

const app = express();

app.get('/test-logger', (req, res) => {
  try {
    logger.info('Logger test endpoint called', { 
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? 'Vercel' : 'Local'
    });
    
    res.status(200).json({
      success: true,
      message: 'Logger test successful',
      environment: process.env.VERCEL ? 'Vercel' : 'Local',
      timestamp: new Date().toISOString()
    });
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