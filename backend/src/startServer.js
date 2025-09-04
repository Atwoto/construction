const app = require('./server.js');

// Database connection and server startup
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    // Start server
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Construction CRM API Server running on http://${HOST}:${PORT}`);
      console.log(`📚 API Documentation available at http://${HOST}:${PORT}/api/docs`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}