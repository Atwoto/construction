const User = require('../models/User');
const Employee = require('../models/Employee');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { createError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * User Management Controller
 * Handles CRUD operations for user management
 */
class UserController {
  // Get all users with pagination and filtering
  getAllUsers = asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = req.query;

      const offset = (page - 1) * limit;
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (role) query = query.eq('role', role);
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder.toLowerCase() === 'asc' });

      const { data: users, count, error } = await query;

      if (error) {
        throw createError.internal('Failed to fetch users', error);
      }

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          users: users.map(user => {
            // Remove sensitive fields
            const { password, password_reset_token, email_verification_token, ...safeUser } = user;
            return safeUser;
          }),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalUsers: count,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      throw error;
    }
  });

  // Get user by ID
  getUserById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      
      if (!user) {
        throw createError.notFound('User not found');
      }

      // Remove sensitive fields
      const { password, password_reset_token, email_verification_token, ...safeUser } = user;

      res.json({
        success: true,
        data: safeUser
      });
    } catch (error) {
      logger.error('Get user by ID error:', error);
      throw error;
    }
  });

  // Create new user
  createUser = asyncHandler(async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role,
        phone,
        address
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);

      if (existingUser) {
        throw createError.badRequest('Email already registered');
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || 'employee'
          }
        }
      });

      if (authError) {
        throw createError.badRequest('Failed to create user in auth system', authError);
      }

      // Create user in our database
      const user = await User.create({
        email,
        first_name: firstName,
        last_name: lastName,
        role: role || 'employee',
        phone,
        address,
        is_active: true,
        is_email_verified: false
      });

      // If role is employee, create employee profile
      if (role === 'employee') {
        await Employee.create({
          user_id: user.id,
          employee_id: `EMP-${Date.now()}`,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          status: 'active'
        });
      }

      // Remove sensitive fields from response
      const { password: pwd, password_reset_token, email_verification_token, ...userData } = user;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userData
      });
    } catch (error) {
      logger.error('Create user error:', error);
      throw error;
    }
  });

  // Update user
  updateUser = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.password;
      delete updates.password_reset_token;
      delete updates.email_verification_token;

      const user = await User.findByPk(id);
      if (!user) {
        throw createError.notFound('User not found');
      }

      // Check if email already exists for another user
      if (updates.email) {
        const existingUser = await User.findOne({
          where: {
            email: updates.email,
            id: { neq: id }
          }
        });
        
        if (existingUser) {
          throw createError.badRequest('Email already registered');
        }
      }

      await user.update(updates);

      // Update employee profile if role is employee
      if (user.role === 'employee') {
        const employee = await Employee.findOne({ where: { user_id: id } });
        if (employee) {
          const employeeUpdates = {};
          if (updates.first_name) employeeUpdates.first_name = updates.first_name;
          if (updates.last_name) employeeUpdates.last_name = updates.last_name;
          if (updates.email) employeeUpdates.email = updates.email;
          if (updates.phone) employeeUpdates.phone = updates.phone;
          if (updates.address) employeeUpdates.address = updates.address;
          
          if (Object.keys(employeeUpdates).length > 0) {
            await employee.update(employeeUpdates);
          }
        }
      }

      // Fetch updated user
      const updatedUser = await User.findByPk(id);

      // Remove sensitive fields
      const { password, password_reset_token, email_verification_token, ...safeUser } = updatedUser;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: safeUser
      });
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  });

  // Change user password
  changePassword = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        throw createError.notFound('User not found');
      }

      // Only admins can change other users passwords
      if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
        throw createError.forbidden('Only admins can change other users passwords');
      }

      // Update password in Supabase Auth
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (authError) {
        throw createError.badRequest('Failed to update password in auth system', authError);
      }

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  });

  // Toggle user status (activate/deactivate)
  toggleUserStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        throw createError.notFound('User not found');
      }

      // Prevent deactivating the last admin
      if (user.role === 'admin' && user.is_active) {
        const { count: activeAdminCount, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin')
          .eq('is_active', true);

        if (countError) {
          throw createError.internal('Failed to count active admins', countError);
        }

        if (activeAdminCount <= 1) {
          throw createError.badRequest('Cannot deactivate the last admin user');
        }
      }

      const newStatus = !user.is_active;
      await user.update({ is_active: newStatus });

      res.json({
        success: true,
        message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
        data: { is_active: newStatus }
      });
    } catch (error) {
      logger.error('Toggle user status error:', error);
      throw error;
    }
  });

  // Delete user (soft delete)
  deleteUser = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        throw createError.notFound('User not found');
      }

      // Prevent deleting the last admin
      if (user.role === 'admin') {
        const { count: activeAdminCount, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin')
          .eq('is_active', true);

        if (countError) {
          throw createError.internal('Failed to count active admins', countError);
        }

        if (activeAdminCount <= 1) {
          throw createError.badRequest('Cannot delete the last admin user');
        }
      }

      // Soft delete
      await user.update({ 
        is_active: false,
        deleted_at: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      throw error;
    }
  });

  // Get user statistics
  getUserStats = asyncHandler(async (req, res) => {
    try {
      // Get total users
      const { count: totalUsers, error: totalError } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw createError.internal('Failed to count total users', totalError);
      }

      // Get active users
      const { count: activeUsers, error: activeError } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) {
        throw createError.internal('Failed to count active users', activeError);
      }

      // Get inactive users
      const { count: inactiveUsers, error: inactiveError } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false);

      if (inactiveError) {
        throw createError.internal('Failed to count inactive users', inactiveError);
      }

      // Get users by role
      const { data: usersByRole, error: roleError } = await supabaseAdmin
        .from('users')
        .select('role');

      if (roleError) {
        throw createError.internal('Failed to get users by role', roleError);
      }

      // Group by role
      const roleCounts = {};
      usersByRole.forEach(user => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });

      // Get recent users
      const { data: recentUsers, error: recentError } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        throw createError.internal('Failed to get recent users', recentError);
      }

      res.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          usersByRole: Object.entries(roleCounts).map(([role, count]) => ({
            role,
            count
          })),
          recentUsers: recentUsers.map(user => {
            // Remove sensitive fields
            const { password, password_reset_token, email_verification_token, ...safeUser } = user;
            return safeUser;
          })
        }
      });
    } catch (error) {
      logger.error('Get user stats error:', error);
      throw error;
    }
  });

  // Get user summary for assignments
  getUsersSummary = asyncHandler(async (req, res) => {
    try {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id,first_name,last_name,email')
        .eq('is_active', true);

      if (error) {
        throw createError.internal('Failed to fetch user summary', error);
      }

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logger.error('Get user summary error:', error);
      throw error;
    }
  });
}

module.exports = new UserController();