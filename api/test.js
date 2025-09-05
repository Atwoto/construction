// Simple test function to check if serverless functions are working
const express = require('express');
const serverless = require('serverless-http');
const { supabase, supabaseAdmin } = require('../backend/src/config/supabase');

const app = express();

app.get('/test/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint is working!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

app.get('/test/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

// Test database connectivity
app.get('/test/api/db-test', async (req, res) => {
  try {
    // Test public client
    const { data: publicData, error: publicError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    // Test admin client
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);
    
    res.status(200).json({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      publicClient: publicError ? { error: publicError.message } : { success: true },
      adminClient: adminError ? { error: adminError.message } : { success: true },
      supabaseAdminAvailable: !!supabaseAdmin
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = serverless(app);