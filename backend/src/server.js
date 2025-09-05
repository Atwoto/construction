const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initializeModels } = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const clientContactRoutes = require('./routes/clientContactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const documentRoutes = require('./routes/documentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Test data routes
const testDataRoutes = require('../../api/test-data-routes');

// Swagger documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./config/swagger');

const app = express();

// Trust proxy for accurate IP addresses in Vercel
// Vercel uses a proxy, so we need to trust the first proxy
if (process.env.VERCEL) {
  app.set('trust proxy', 1);
} else {
  app.set('trust proxy', false);
}

// Rate limiting with proper IP detection for Vercel
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to handle IP detection in Vercel
  keyGenerator: (req) => {
    // For Vercel deployments, try to get the real IP from headers
    if (process.env.VERCEL) {
      // Try different headers that might contain the real IP
      const realIP = req.headers['x-real-ip'] || 
                    req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null);
      
      if (realIP) {
        // Handle multiple IPs in x-forwarded-for (comma-separated)
        return realIP.split(',')[0].trim();
      }
    }
    
    // Default behavior
    return req.ip;
  }
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOrigin = process.env.VERCEL 
  ? [process.env.CORS_ORIGIN || '*', 'https://construction.vercel.app']
  : process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Apply rate limiting to all requests
// app.use(limiter);

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: require('../package.json').version,
  });
});

// Additional health check for Vercel
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Construction CRM API is running',
    timestamp: new Date().toISOString(),
  });
});

// Test data endpoints (for debugging)
app.use('/test', testDataRoutes);

// API routes
const apiPrefix = '/api';
app.use(apiPrefix + '/auth', authRoutes);
app.use(apiPrefix + '/users', userRoutes);
app.use(apiPrefix + '/clients', clientRoutes);
app.use(apiPrefix + '/client-contacts', clientContactRoutes);
app.use(apiPrefix + '/projects', projectRoutes);
app.use(apiPrefix + '/invoices', invoiceRoutes);
app.use(apiPrefix + '/employees', employeeRoutes);
app.use(apiPrefix + '/inventory', inventoryRoutes);
app.use(apiPrefix + '/documents', documentRoutes);
app.use(apiPrefix + '/reports', reportRoutes);

// Swagger documentation
if (!process.env.VERCEL) {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  const swaggerOptions = require('./config/swagger');
  const specs = swaggerJsdoc(swaggerOptions);
  const docsPrefix = '/api';
  app.use(docsPrefix + '/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Construction CRM API Documentation',
  }));
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// Database connection and server startup
initializeModels(); // This line should be here

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'localhost'; // This line was missing

async function startServer() {
  try {
    // Start server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Construction CRM API Server running on http://${HOST}:${PORT}`);
      logger.info(`📚 API Documentation available at http://${HOST}:${PORT}/api/docs`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;