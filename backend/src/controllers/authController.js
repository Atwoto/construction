const { validationResult } = require('express-validator');
const { supabase, supabaseAdmin } = require('../config/supabase');
const User = require('../models/User');
const { createError, asyncHandler } = require('../middleware/errorHandler');
const AuthUtils = require('../utils/authUtils');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 */
class AuthController {
  /**
   * User registration
   */
  static register = asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.badRequest('Validation failed', errors.array());
    }

    const { email, password, firstName, lastName, role = 'employee' } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw createError.conflict('User with this email already exists');
    }

    // Validate password strength
    const passwordValidation = AuthUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw createError.badRequest('Password does not meet requirements', {
        errors: passwordValidation.errors,
        score: passwordValidation.score,
      });
    }

    try {
      // Create user in our database directly (without Supabase Auth)
      const userData = {
        email: email.toLowerCase(),
        password: password, // Include the password here
        first_name: firstName,
        last_name: lastName,
        role,
        is_email_verified: true // Set to true to avoid verification isses
      };

      const user = await User.create(userData);
      
      // Log registration event
      AuthUtils.logAuthEvent('user_registered', user, req, {
        role: user.role,
      });

      logger.info(`New user registered: ${email}`, {
        userId: user.id,
        role: user.role,
      });

      // Generate JWT token and refresh token for immediate login
      const token = AuthUtils.generateToken(user);
      const refreshToken = AuthUtils.generateRefreshToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        data: {
          user: AuthUtils.sanitizeUser(user),
          token,
          refreshToken
        }
      });
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError.internal('Registration failed', error.message);
    }
  });

  /**
   * User login
   */
  static login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.badRequest('Validation failed', errors.array());
    }

    const { email, password } = req.body;

    try {
      // Find user in our database
      const user = await User.findByEmail(email);
      if (!user) {
        throw createError.unauthorized('Invalid credentials');
      }

      // Check if account is locked
      if (user.isAccountLocked()) {
        const lockTime = Math.ceil((new Date(user.account_locked_until) - Date.now()) / (1000 * 60));
        throw createError.unauthorized(`Account is locked. Try again in ${lockTime} minutes`);
      }

      // Check if account is active
      if (!user.is_active) {
        throw createError.unauthorized('Account is deactivated');
      }

      // Validate password
      const isPasswordValid = await AuthUtils.validatePassword(password, user.password);
      if (!isPasswordValid) {
        // Increment login attempts
        await user.incrementLoginAttempts();
        throw createError.unauthorized('Invalid credentials');
      }

      // Reset login attempts and update last login
      await user.resetLoginAttempts();

      // Generate JWT token
      const token = AuthUtils.generateToken(user);
      const refreshToken = AuthUtils.generateRefreshToken(user);

      // Log successful login
      AuthUtils.logAuthEvent('login_success', user, req);

      logger.info(`User logged in: ${email}`, {
        userId: user.id,
        role: user.role,
      });

      res.json({
        message: 'Login successful',
        data: {
          user: AuthUtils.sanitizeUser(user),
          token,
          refreshToken
        }
      });
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError.unauthorized('Invalid credentials');
    }
  });

  /**
   * Refresh access token
   */
  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError.badRequest('Refresh token is required');
    }

    try {
      // Verify refresh token
      const decoded = AuthUtils.verifyRefreshToken(refreshToken);
      
      // Find user in our database
      const user = await User.findByPk(decoded.id);
      
      if (!user || !user.is_active) {
        throw createError.unauthorized('Invalid refresh token');
      }

      // Generate new tokens
      const token = AuthUtils.generateToken(user);
      const newRefreshToken = AuthUtils.generateRefreshToken(user);

      // Log token refresh
      AuthUtils.logAuthEvent('token_refreshed', user, req);

      res.json({
        message: 'Token refreshed successfully',
        token,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      AuthUtils.logAuthEvent('token_refresh_failed', null, req, {
        error: error.message,
      });
      
      if (error.statusCode) {
        throw error;
      }
      throw createError.unauthorized('Invalid or expired refresh token');
    }
  });

  /**
   * User logout
   */
  static logout = asyncHandler(async (req, res) => {
    try {
      // Log logout event
      AuthUtils.logAuthEvent('logout', req.user, req);

      logger.info(`User logged out: ${req.user.email}`, {
        userId: req.user.id,
      });

      res.json({
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout error:', error.message);
      res.json({
        message: 'Logout processed',
      });
    }
  });

  /**
   * Get current user profile
   */
  static getProfile = asyncHandler(async (req, res) => {
    res.json({
      user: AuthUtils.sanitizeUser(req.user),
    });
  });

  /**
   * Update user profile
   */
  static updateProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.badRequest('Validation failed', errors.array());
    }

    const { firstName, lastName, phone, address } = req.body;
    const user = req.user;

    // Update user
    await user.update({
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
    });

    logger.info(`User profile updated: ${user.email}`, {
      userId: user.id,
    });

    res.json({
      message: 'Profile updated successfully',
      user: AuthUtils.sanitizeUser(user),
    });
  });

  /**
   * Change password
   */
  static changePassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.badRequest('Validation failed', errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    try {
      // Update password with Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw createError.badRequest('Failed to update password', error.message);
      }

      // Log password change
      AuthUtils.logAuthEvent('password_changed', user, req);

      logger.info(`Password changed for user: ${user.email}`, {
        userId: user.id,
      });

      res.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError.badRequest('Failed to update password', error.message);
    }
  });

  /**
   * Forgot password
   */
  static forgotPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.badRequest('Validation failed', errors.array());
    }

    const { email } = req.body;

    try {
      // Send password reset email with Supabase Auth
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`
      });

      if (error) {
        logger.warn('Password reset error:', error.message);
      }

      // Log password reset request
      const user = await User.findByEmail(email);
      if (user) {
        AuthUtils.logAuthEvent('password_reset_requested', user, req);
        logger.info(`Password reset requested for: ${email}`, {
          userId: user.id,
        });
      }

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent',
      });
    } catch (error) {
      logger.error('Forgot password error:', error.message);
      res.json({
        message: 'If an account with that email exists, a password reset link has been sent',
      });
    }
  });

  /**
   * Reset password
   */
  static resetPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.badRequest('Validation failed', errors.array());
    }

    const { token, newPassword } = req.body;

    try {
      // Update password with Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw createError.badRequest('Invalid or expired reset token');
      }

      // Get user from Supabase
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !supabaseUser) {
        throw createError.badRequest('Failed to get user');
      }

      // Find user in our database
      const user = await User.findByEmail(supabaseUser.email);
      if (!user) {
        throw createError.badRequest('User not found');
      }

      // Clear reset token fields
      await user.update({
        password_reset_token: null,
        password_reset_expires: null,
        login_attempts: 0,
        account_locked_until: null,
      });

      // Log password reset
      AuthUtils.logAuthEvent('password_reset_completed', user, req);

      logger.info(`Password reset completed for: ${user.email}`, {
        userId: user.id,
      });

      res.json({
        message: 'Password reset successfully',
      });
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError.badRequest('Invalid or expired reset token');
    }
  });

  /**
   * Verify email
   */
  static verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({
      where: {
        email_verification_token: token,
        is_email_verified: false,
      },
    });

    if (!user) {
      throw createError.badRequest('Invalid or expired verification token');
    }

    // Update user as verified
    await user.update({
      is_email_verified: true,
      email_verification_token: null,
    });

    // Log email verification
    AuthUtils.logAuthEvent('email_verified', user, req);

    logger.info(`Email verified for: ${user.email}`, {
      userId: user.id,
    });

    res.json({
      message: 'Email verified successfully',
    });
  });

  /**
   * Resend email verification
   */
  static resendEmailVerification = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.is_email_verified) {
      throw createError.badRequest('Email is already verified');
    }

    try {
      // Resend verification email with Supabase Auth
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        logger.warn('Resend verification error:', error.message);
      }

      logger.info(`Email verification resent for: ${user.email}`, {
        userId: user.id,
      });

      res.json({
        message: 'Verification email sent',
      });
    } catch (error) {
      logger.error('Resend verification error:', error.message);
      res.json({
        message: 'Verification email sent',
      });
    }
  });
}

module.exports = AuthController;