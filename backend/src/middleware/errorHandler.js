const logger = require('../utils/logger');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Convert error to ApiError instance
 * @param {Error} err - Original error
 * @returns {ApiError} Converted API error
 */
const convertToApiError = (err) => {
  let error = err;
  
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  return error;
};

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = convertToApiError(err);
  
  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
    error = new ApiError(400, 'Validation Error', true);
    error.errors = errors;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    const message = `${field} already exists`;
    error = new ApiError(409, message, true);
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = new ApiError(400, 'Referenced record does not exist', true);
  } else if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token', true);
  } else if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired', true);
  } else if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ApiError(400, 'File too large', true);
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error = new ApiError(400, 'Too many files', true);
    } else {
      error = new ApiError(400, 'File upload error', true);
    }
  } else if (err.name === 'ValidationError') {
    // Express-validator errors
    error = new ApiError(400, 'Validation Error', true);
    error.errors = err.array ? err.array() : [{ message: err.message }];
  }
  
  // Log error
  const logMessage = `${req.method} ${req.originalUrl} - ${error.statusCode} - ${error.message}`;
  const logMeta = {
    error: {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
  };
  
  if (error.statusCode >= 500) {
    logger.error(logMessage, logMeta);
  } else {
    logger.warn(logMessage, logMeta);
  }
  
  // Prepare error response
  const errorResponse = {
    error: error.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };
  
  // Add validation errors if present
  if (error.errors) {
    errorResponse.errors = error.errors;
  }
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }
  
  // Send error response
  res.status(error.statusCode).json(errorResponse);
};

/**
 * Handle async errors in route handlers
 * @param {Function} fn - Async function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Handle 404 errors for unknown routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Create standardized error responses
 */
const createError = {
  badRequest: (message = 'Bad Request') => new ApiError(400, message),
  unauthorized: (message = 'Unauthorized') => new ApiError(401, message),
  forbidden: (message = 'Forbidden') => new ApiError(403, message),
  notFound: (message = 'Not Found') => new ApiError(404, message),
  conflict: (message = 'Conflict') => new ApiError(409, message),
  unprocessableEntity: (message = 'Unprocessable Entity') => new ApiError(422, message),
  tooManyRequests: (message = 'Too Many Requests') => new ApiError(429, message),
  internal: (message = 'Internal Server Error') => new ApiError(500, message),
  notImplemented: (message = 'Not Implemented') => new ApiError(501, message),
  badGateway: (message = 'Bad Gateway') => new ApiError(502, message),
  serviceUnavailable: (message = 'Service Unavailable') => new ApiError(503, message),
};

module.exports = {
  ApiError,
  errorHandler,
  asyncHandler,
  notFoundHandler,
  createError,
};