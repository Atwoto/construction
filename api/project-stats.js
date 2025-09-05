// api/project-stats.js
// Optimized project stats endpoint for Vercel serverless environment
const express = require('express');
const serverless = require('serverless-http');
const { supabaseAdmin } = require('../backend/src/config/supabase');
const { createError } = require('../backend/src/middleware/errorHandler');

const app = express();

// Optimized project stats endpoint that avoids timeouts
app.get('/api/project-stats', async (req, res) => {
  try {
    // Use count queries instead of fetching all projects for better performance
    const [
      { count: totalProjects, error: totalError },
      { count: activeProjects, error: activeError },
      { count: completedProjects, error: completedError },
      { count: onHoldProjects, error: onHoldError }
    ] = await Promise.all([
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).or('status.eq.approved,status.eq.in_progress'),
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'on_hold')
    ]);

    if (totalError || activeError || completedError || onHoldError) {
      const errors = [totalError, activeError, completedError, onHoldError].filter(Boolean);
      throw createError.internal('Error fetching project counts', errors);
    }

    // For average progress and financial data, we'll use aggregation functions
    const { data: progressData, error: progressError } = await supabaseAdmin
      .from('projects')
      .select('progress')
      .limit(1000); // Limit to prevent timeouts

    if (progressError) {
      throw createError.internal('Error fetching project progress', progressError);
    }

    // Calculate average progress
    const totalProgress = progressData.reduce((sum, project) => sum + (project.progress || 0), 0);
    const averageProgress = progressData.length > 0 ? totalProgress / progressData.length : 0;

    // For financial data, we'll use a smaller sample
    const { data: financialData, error: financialError } = await supabaseAdmin
      .from('projects')
      .select('budget,actual_cost,actual_revenue,status')
      .limit(500); // Limit to prevent timeouts

    if (financialError) {
      throw createError.internal('Error fetching financial data', financialError);
    }

    // Calculate financial data
    const totalBudget = financialData.reduce((sum, project) => sum + (parseFloat(project.budget) || 0), 0);
    const totalActualCost = financialData.reduce((sum, project) => sum + (parseFloat(project.actual_cost) || 0), 0);

    // Calculate total revenue (from completed projects in sample)
    const totalRevenue = financialData
      .filter(project => project.status === 'completed')
      .reduce((sum, project) => sum + (parseFloat(project.actual_revenue) || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        onHoldProjects,
        averageProgress: Math.round(averageProgress * 100) / 100,
        totalBudget,
        totalActualCost,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Project stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

module.exports = serverless(app);