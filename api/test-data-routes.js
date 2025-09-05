const express = require('express');
const { supabase } = require('../backend/src/config/supabase');

const router = express.Router();

// Simple endpoint to get all clients without any middleware
router.get('/test-clients', async (req, res) => {
  try {
    console.log('Fetching clients directly from Supabase...');
    
    // Direct query to Supabase without any complex middleware
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch clients',
        details: error.message 
      });
    }
    
    console.log(`Successfully retrieved ${data.length} clients`);
    res.json({ 
      success: true, 
      count: data.length, 
      data: data 
    });
  } catch (error) {
    console.error('Exception in test-clients endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Simple endpoint to get all projects
router.get('/test-projects', async (req, res) => {
  try {
    console.log('Fetching projects directly from Supabase...');
    
    // Direct query to Supabase without any complex middleware
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch projects',
        details: error.message 
      });
    }
    
    console.log(`Successfully retrieved ${data.length} projects`);
    res.json({ 
      success: true, 
      count: data.length, 
      data: data 
    });
  } catch (error) {
    console.error('Exception in test-projects endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

module.exports = router;