const express = require('express');
const serverless = require('serverless-http');
const { supabaseAdmin } = require('../backend/src/config/supabase');

const app = express();

app.get('/test-project-stats', async (req, res) => {
  try {
    // Test Supabase connection and data access
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id, name, status, budget', { count: 'exact' })
      .limit(5);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error
      });
    }

    // Get counts for different statuses
    const { count: totalCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { count: activeCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: completedCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    res.status(200).json({
      success: true,
      data: {
        sampleProjects: data,
        counts: {
          total: totalCount,
          active: activeCount,
          completed: completedCount
        }
      },
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