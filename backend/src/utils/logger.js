const fs = require('fs');
const path = require('path');

// Determine logs directory based on environment
let logsDir;

if (process.env.VERCEL) {
  // In Vercel serverless environment, use tmp directory for logs
  logsDir = path.join('/tmp', 'logs');
} else {
  // In other environments, use local logs directory
  logsDir = path.join(__dirname, '../../logs');
}

// Ensure logs directory exists (only in non-Vercel environments since /tmp might not be writable in some cases)
if (!process.env.VERCEL) {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (err) {
    // If we can't create the logs directory, we'll skip file logging
    console.warn('Could not create logs directory, file logging disabled:', err.message);
  }
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} meta - Additional metadata
 * @returns {string} Formatted log message
 */
function formatMessage(level, message, meta = null) {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}\n`;
}

/**
 * Write log to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} meta - Additional metadata
 */
function writeToFile(level, message, meta) {
  // Skip file logging in Vercel serverless environment
  if (process.env.NODE_ENV === 'test' || process.env.VERCEL) return;

  // Skip file logging if logs directory doesn't exist and can't be created
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (err) {
    // If we can't create the logs directory, skip file logging
    return;
  }

  const logFile = path.join(logsDir, `${level}.log`);
  const formattedMessage = formatMessage(level, message, meta);
  
  fs.appendFile(logFile, formattedMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  // Also write to combined log
  const combinedLogFile = path.join(logsDir, 'combined.log');
  fs.appendFile(combinedLogFile, formattedMessage, (err) => {
    if (err) {
      console.error('Failed to write to combined log file:', err);
    }
  });
}

/**
 * Log to console with colors
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} meta - Additional metadata
 */
function logToConsole(level, message, meta) {
  const colors = {
    error: '\x1b[31m', // Red
    warn: '\x1b[33m',  // Yellow
    info: '\x1b[36m',  // Cyan
    debug: '\x1b[90m', // Gray
  };
  
  const resetColor = '\x1b[0m';
  const timestamp = new Date().toISOString();
  const color = colors[level] || '';
  
  const formattedMessage = `${color}[${timestamp}] [${level.toUpperCase()}] ${message}${resetColor}`;
  
  if (meta) {
    console.log(formattedMessage, meta);
  } else {
    console.log(formattedMessage);
  }
}

/**
 * Generic log function
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} meta - Additional metadata
 */
function log(level, message, meta = null) {
  const levelNum = LOG_LEVELS[level.toUpperCase()];
  
  if (levelNum <= currentLogLevel) {
    logToConsole(level, message, meta);
    writeToFile(level, message, meta);
  }
}

/**
 * Logger object with convenience methods
 */
const logger = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
  
  // Special method for HTTP requests
  http: (req, res, responseTime) => {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`;
    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };
    log('info', message, meta);
  },
  
  // Special method for database queries
  db: (query, duration) => {
    if (process.env.NODE_ENV === 'development') {
      const message = `DB Query executed in ${duration}ms`;
      const meta = { query, duration };
      log('debug', message, meta);
    }
  },
  
  // Special method for authentication events
  auth: (event, userId, details = {}) => {
    const message = `Auth event: ${event} for user ${userId}`;
    const meta = { event, userId, ...details };
    log('info', message, meta);
  },
  
  // Log file paths (for reference)
  getLogPath: (level = 'combined') => process.env.VERCEL ? null : path.join(logsDir, `${level}.log`),
};

module.exports = logger;