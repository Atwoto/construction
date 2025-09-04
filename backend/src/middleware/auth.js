const AuthUtils = require('../utils/authUtils');
const { createError, asyncHandler } = require('./errorHandler');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Extract token from header
  const authHeader = req.headers.authorization;
  const token = AuthUtils.extractTokenFromHeader(authHeader);

  if (!token) {
    throw createError.unauthorized('Access token is required');
  }

  try {
    // Verify JWT token
    const decoded = AuthUtils.verifyToken(token);
    
    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw createError.unauthorized('User not found');
    }

    if (!user.is_active) {
      throw createError.unauthorized('Account is deactivated');
    }

    if (user.isAccountLocked()) {
      throw createError.unauthorized('Account is temporarily locked');
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createError.unauthorized('Invalid or expired token');
  }
});

/**
 * Middleware to check if user has required role(s)
 * @param {string|Array} roles - Required role(s)
 */
const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const userRole = req.user.role;
    const hasRole = AuthUtils.hasRole(userRole, roles);

    if (!hasRole) {
      logger.warn(`Access denied for user ${req.user.id} with role ${userRole}`, {
        requiredRoles: roles,
        requestedResource: req.originalUrl,
        method: req.method,
      });
      
      throw createError.forbidden('Insufficient permissions');
    }

    next();
  });
};

/**
 * Middleware to check if user has minimum permission level
 * @param {string} minRole - Minimum required role
 */
const requirePermission = (minRole) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const hasPermission = AuthUtils.hasPermission(req.user.role, minRole);

    if (!hasPermission) {
      logger.warn(`Permission denied for user ${req.user.id}`, {
        userRole: req.user.role,
        requiredRole: minRole,
        requestedResource: req.originalUrl,
        method: req.method,
      });
      
      throw createError.forbidden('Insufficient permissions');
    }

    next();
  });
};

/**
 * Middleware to check if user owns the resource or has admin privileges
 * @param {string} resourceIdParam - Parameter name for resource ID
 * @param {string} ownerField - Field name for owner ID (default: 'userId')
 */
const requireOwnershipOrAdmin = (resourceIdParam, ownerField = 'userId') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // If checking ownership of user resource
    if (resourceIdParam === 'userId' || resourceIdParam === 'id') {
      if (parseInt(resourceId) !== userId) {
        throw createError.forbidden('Can only access your own resources');
      }
      return next();
    }

    // For other resources, need to fetch and check ownership
    // This would require model-specific logic
    // For now, just check if user has manager+ permissions
    const hasPermission = AuthUtils.hasPermission(req.user.role, 'manager');
    if (!hasPermission) {
      throw createError.forbidden('Insufficient permissions');
    }

    next();
  });
};

/**
 * Optional authentication middleware (doesn't throw if no token)
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = AuthUtils.extractTokenFromHeader(authHeader);

  if (!token) {
    return next();
  }

  try {
    const user = await AuthUtils.getUserFromToken(token);

    if (user && user.is_active && !user.isAccountLocked()) {
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional authentication failed:', error.message);
  }

  next();
});

/**
 * Middleware to log authentication events
 */
const logAuthActivity = (event) => {
  return (req, res, next) => {
    if (req.user) {
      AuthUtils.logAuthEvent(event, req.user, req);
    }
    next();
  };
};

/**
 * Middleware to check if user can access client data
 */
const canAccessClient = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw createError.unauthorized('Authentication required');
  }

  // Admin can access all clients
  if (req.user.role === 'admin') {
    return next();
  }

  const clientId = req.params.clientId || req.params.id;
  
  // Managers can access all clients
  if (req.user.role === 'manager') {
    return next();
  }

  // Employees can only access assigned clients
  // This would need to check assignment in the database
  const hasPermission = AuthUtils.hasPermission(req.user.role, 'manager');
  if (!hasPermission) {
    throw createError.forbidden('Cannot access this client');
  }

  next();
});

/**
 * Middleware to check if user can access project data
 */
const canAccessProject = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw createError.unauthorized('Authentication required');
  }

  // Admin can access all projects
  if (req.user.role === 'admin') {
    return next();
  }

  const projectId = req.params.projectId || req.params.id;
  
  // Managers can access all projects
  if (req.user.role === 'manager') {
    return next();
  }

  // Employees can only access assigned projects
  // This would need to check assignment in the database
  const hasPermission = AuthUtils.hasPermission(req.user.role, 'manager');
  if (!hasPermission) {
    throw createError.forbidden('Cannot access this project');
  }

  next();
});

/**
 * Admin only middleware
 */
const adminOnly = authorize('admin');

/**
 * Manager and above middleware
 */
const managerOrAbove = requirePermission('manager');

/**
 * Authenticated users only
 */
const authRequired = authenticate;

module.exports = {
  authenticate,
  authorize,
  requirePermission,
  requireOwnershipOrAdmin,
  optionalAuth,
  logAuthActivity,
  canAccessClient,
  canAccessProject,
  adminOnly,
  managerOrAbove,
  authRequired,
};