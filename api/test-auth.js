const express = require('express');
const serverless = require('serverless-http');
const { supabaseAdmin } = require('../backend/src/config/supabase');

const app = express();

// Simple auth test endpoint
app.get('/test-auth', async (req, res) => {
  try {
    // This endpoint doesn't require authentication, but we can test Supabase connection
    res.status(200).json({
      success: true,
      message: 'Auth test endpoint working',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? 'Vercel' : 'Local'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test Supabase connection
app.get('/test-supabase', async (req, res) => {
  try {
    // Test Supabase connection by querying a simple table
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
      data: data,
      environment: process.env.VERCEL ? 'Vercel' : 'Local'
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