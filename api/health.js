// Simple health check for the API
export default async function handler(request, response) {
  try {
    // Import the Supabase client
    const { supabaseAdmin } = require('../backend/src/config/supabase');
    
    // Test Supabase connection
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error);
      return response.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      });
    }
    
    response.status(200).json({
      status: 'OK',
      message: 'API is running and connected to database',
      projectCount: data.count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    response.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
}