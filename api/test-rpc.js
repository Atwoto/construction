
// api/test-rpc.js
const { supabaseAdmin } = require('../backend/src/config/supabase');
const logger = require('../backend/src/utils/logger');

module.exports = async (req, res) => {
  try {
    logger.info('Attempting to call get_project_statistics RPC function.');

    if (!supabaseAdmin) {
      logger.error('supabaseAdmin is null. SUPABASE_SERVICE_ROLE_KEY is likely missing.');
      return res.status(500).json({ 
        error: 'Server configuration error: supabaseAdmin is not initialized.',
        suggestion: 'Ensure SUPABASE_SERVICE_ROLE_KEY is set in Vercel environment variables.'
      });
    }

    const { data, error } = await supabaseAdmin.rpc('get_project_statistics');

    if (error) {
      logger.error('RPC call failed with error:', error);
      // Send the detailed error back in the response for debugging
      return res.status(500).json({
        message: 'The RPC call failed. See the error details.',
        error: error,
      });
    }

    logger.info('RPC call successful.');
    // Send the successful data back
    res.status(200).json({
      message: 'RPC call was successful!',
      data: data,
    });

  } catch (e) {
    logger.error('An unexpected exception occurred in test-rpc handler:', e);
    // Catch any other unexpected errors
    res.status(500).json({
      message: 'An unexpected server exception occurred.',
      error: e.message,
    });
  }
};
