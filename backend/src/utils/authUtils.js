const bcrypt = require('bcryptjs');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { createError } = require('../middleware/errorHandler');
const logger = require('./logger');

/**
 * Supabase Authentication Utilities
 */
class AuthUtils {
  /**
   * Hash password
   * @param {string} password - Plain password
   * @returns {string} Hashed password
   */
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Validate password
   * @param {string} password - Plain password
   * @param {string} hashedPassword - Hashed password
   * @returns {boolean} Is valid
   */
  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  static generateToken(user) {
    const jwt = require('jsonwebtoken');
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    const secret = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-production';
    
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} Refresh token
   */
  static generateRefreshToken(user) {
    const jwt = require('jsonwebtoken');
    const payload = {
      id: user.id,
      email: user.email,
    };
    
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-refresh-secret-key-change-in-production';
    
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} Extracted token
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Generate password reset token
   * @returns {string} Password reset token
   */
  static generatePasswordResetToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Generate email verification token
   * @returns {string} Email verification token
   */
  static generateEmailVerificationToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Hash password reset token
   * @param {string} token - Plain token
   * @returns {string} Hashed token
   */
  static hashResetToken(token) {
    return require('crypto').createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate secure random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  static generateSecureRandom(length = 32) {
    return require('crypto').randomBytes(length).toString('hex');
  }

  /**
   * Check if user has required role
   * @param {string} userRole - User's role
   * @param {string|Array} requiredRoles - Required role(s)
   * @returns {boolean} Has required role
   */
  static hasRole(userRole, requiredRoles) {
    if (typeof requiredRoles === 'string') {
      return userRole === requiredRoles;
    }
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    
    return false;
  }

  /**
   * Check if user has sufficient permission level
   * @param {string} userRole - User's role
   * @param {string} requiredRole - Required minimum role
   * @returns {boolean} Has sufficient permission
   */
  static hasPermission(userRole, requiredRole) {
    const roleHierarchy = {
      employee: 1,
      manager: 2,
      admin: 3,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  /**
   * Create user session data
   * @param {Object} user - User object
   * @returns {Object} Session data
   */
  static createSessionData(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      loginAt: new Date(),
    };
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  static validatePasswordStrength(password) {
    const result = {
      isValid: true,
      errors: [],
      score: 0,
    };

    if (!password) {
      result.isValid = false;
      result.errors.push('Password is required');
      return result;
    }

    if (password.length < 8) {
      result.isValid = false;
      result.errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      result.isValid = false;
      result.errors.push('Password must not exceed 128 characters');
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      result.errors.push('Password must contain at least one uppercase letter');
      result.score -= 1;
    } else {
      result.score += 1;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      result.errors.push('Password must contain at least one lowercase letter');
      result.score -= 1;
    } else {
      result.score += 1;
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      result.errors.push('Password must contain at least one number');
      result.score -= 1;
    } else {
      result.score += 1;
    }

    // Check for special character
    if (!/[^A-Za-z0-9]/.test(password)) {
      result.errors.push('Password must contain at least one special character');
      result.score -= 1;
    } else {
      result.score += 1;
    }

    // Additional strength checks
    if (password.length >= 12) result.score += 1;
    if (/(.)\1{2,}/.test(password)) result.score -= 1; // Repeated characters
    
    result.score = Math.max(0, Math.min(5, result.score));

    return result;
  }

  /**
   * Rate limit key generator
   * @param {string} identifier - Identifier (IP, email, etc.)
   * @param {string} action - Action type
   * @returns {string} Rate limit key
   */
  static generateRateLimitKey(identifier, action) {
    return `rate_limit:${action}:${identifier}`;
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static verifyToken(token) {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-production';
    return jwt.verify(token, secret);
  }

  /**
   * Verify refresh token
   * @param {string} token - Refresh token
   * @returns {Object} Decoded token payload
   */
  static verifyRefreshToken(token) {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-refresh-secret-key-change-in-production';
    return jwt.verify(token, secret);
  }

  /**
   * Log authentication event
   * @param {string} event - Event type
   * @param {Object} user - User object
   * @param {Object} req - Request object
   * @param {Object} details - Additional details
   */
  static logAuthEvent(event, user, req, details = {}) {
    const logData = {
      event,
      userId: user?.id,
      email: user?.email,
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      timestamp: new Date(),
      ...details,
    };

    logger.auth(event, user?.id, logData);
  }

  /**
   * Sanitize user data for response
   * @param {Object} user - User object
   * @returns {Object} Sanitized user data
   */
  static sanitizeUser(user) {
    const {
      password,
      password_reset_token,
      password_reset_expires,
      email_verification_token,
      account_locked_until,
      login_attempts,
      ...safeUser
    } = user.toJSON ? user.toJSON() : user;

    return safeUser;
  }

  /**
   * Get user from Supabase Auth token
   * @param {string} accessToken - Supabase access token
   * @returns {Object} User object or null
   */
  static async getUserFromToken(accessToken) {
    try {
      // Get user from Supabase
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      
      if (error) {
        logger.error('Error getting user from token:', error.message);
        return null;
      }
      
      if (!user) {
        return null;
      }
      
      // Get user data from our database
      const dbUser = await require('../models/User').findByEmail(user.email);
      
      if (!dbUser) {
        return null;
      }
      
      return dbUser;
    } catch (error) {
      logger.error('Error getting user from token:', error.message);
      return null;
    }
  }
}

module.exports = AuthUtils;