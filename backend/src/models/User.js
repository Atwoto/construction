const { supabase, supabaseAdmin } = require('../config/supabase');
const { createError } = require('../middleware/errorHandler');
const AuthUtils = require('../utils/authUtils');
const logger = require('../utils/logger');

/**
 * User model for Supabase
 */
class User {
  constructor(data) {
    Object.assign(this, data);
  }

  // Static methods
  static async findByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Database error in User.findByEmail:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return new User(data);
  }

  static async findByPk(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Database error in User.findByPk:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return new User(data);
  }

  static async findOne(options) {
    const { where } = options;
    let query = supabaseAdmin.from('users').select('*');

    // Apply filters
    for (const [key, value] of Object.entries(where)) {
      if (key === 'passwordResetExpires') {
        // Handle special case for date comparison
        if (value[Object.keys(value)[0]]) {
          const operator = Object.keys(value)[0];
          const dateValue = value[operator];
          query = query.gte('password_reset_expires', dateValue.toISOString());
        }
      } else {
        query = query.eq(key, value);
      }
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Database error in User.findOne:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return new User(data);
  }

  static async findAll(options = {}) {
    let query = supabaseAdmin.from('users').select('*');

    // Apply where conditions
    if (options.where) {
      const { where } = options;
      for (const [key, value] of Object.entries(where)) {
        if (key === 'isActive') {
          query = query.eq('is_active', value);
        } else if (key === 'role') {
          query = query.eq('role', value);
        } else {
          query = query.eq(key, value);
        }
      }
    }

    // Apply ordering
    if (options.order) {
      const [field, direction] = options.order;
      query = query.order(field, { ascending: direction.toLowerCase() === 'asc' });
    }

    // Apply limit and offset
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error in User.findAll:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return data.map(user => new User(user));
  }

  static async create(userData) {
    // Prepare data for insertion - only include columns that exist in the database
    const insertData = {
      email: userData.email?.toLowerCase(),
      first_name: userData.first_name || userData.firstName,
      last_name: userData.last_name || userData.lastName,
      role: userData.role || 'employee',
      phone: userData.phone,
      address: userData.address,
      profile_picture: userData.profile_picture || userData.profilePicture,
      is_active: userData.is_active !== undefined ? userData.is_active : (userData.isActive !== undefined ? userData.isActive : true),
      is_email_verified: userData.is_email_verified !== undefined ? userData.is_email_verified : (userData.isEmailVerified || false),
      email_verification_token: userData.email_verification_token || userData.emailVerificationToken,
      password_reset_token: userData.password_reset_token || userData.passwordResetToken,
      password_reset_expires: userData.password_reset_expires || userData.passwordResetExpires,
      last_login_at: userData.last_login_at || userData.lastLoginAt,
      login_attempts: userData.login_attempts !== undefined ? userData.login_attempts : (userData.loginAttempts || 0),
      account_locked_until: userData.account_locked_until || userData.accountLockedUntil,
      preferences: userData.preferences || {},
      metadata: userData.metadata || {},
    };

    // Handle password separately to ensure it's properly hashed
    if (userData.password) {
      insertData.password = await AuthUtils.hashPassword(userData.password);
    }

    // Use supabaseAdmin for create operations to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw createError.conflict('User with this email already exists');
      }
      console.error('Database error in User.create:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return new User(data);
  }

  static async count(options = {}) {
    let query = supabaseAdmin.from('users').select('*', { count: 'exact', head: true });

    // Apply where conditions
    if (options.where) {
      const { where } = options;
      for (const [key, value] of Object.entries(where)) {
        if (key === 'isActive') {
          query = query.eq('is_active', value);
        } else if (key === 'role') {
          query = query.eq('role', value);
        } else {
          query = query.eq(key, value);
        }
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error('Database error in User.count:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return count;
  }

  // Instance methods
  toJSON() {
    return { ...this };
  }

  async update(updates) {
    const updateData = {};
    
    // Map camelCase to snake_case
    for (const [key, value] of Object.entries(updates)) {
      switch (key) {
        case 'firstName':
          updateData.first_name = value;
          break;
        case 'lastName':
          updateData.last_name = value;
          break;
        case 'isActive':
          updateData.is_active = value;
          break;
        case 'isEmailVerified':
          updateData.is_email_verified = value;
          break;
        case 'emailVerificationToken':
          updateData.email_verification_token = value;
          break;
        case 'passwordResetToken':
          updateData.password_reset_token = value;
          break;
        case 'passwordResetExpires':
          updateData.password_reset_expires = value;
          break;
        case 'lastLoginAt':
          updateData.last_login_at = value;
          break;
        case 'loginAttempts':
          updateData.login_attempts = value;
          break;
        case 'accountLockedUntil':
          updateData.account_locked_until = value;
          break;
        case 'dateOfBirth':
          updateData.date_of_birth = value;
          break;
        case 'emergencyContact':
          updateData.emergency_contact = value;
          break;
        case 'employeeProfile':
          updateData.employee_profile = value;
          break;
        default:
          updateData[key] = value;
      }
    }

    // Use supabaseAdmin for update operations to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', this.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw createError.conflict('User with this email already exists');
      }
      console.error('Database error in User.update:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    // Update current instance
    Object.assign(this, data);
    return this;
  }

  async delete() {
    // Use supabaseAdmin for delete operations to bypass RLS
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', this.id);

    if (error) {
      console.error('Database error in User.delete:', error);
      throw createError.internal('Database error: ' + (error.message || 'Unknown error'));
    }

    return true;
  }

  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  isAccountLocked() {
    return this.account_locked_until && new Date(this.account_locked_until) > new Date();
  }

  async incrementLoginAttempts() {
    const maxAttempts = 5;
    const lockTime = 30 * 60 * 1000; // 30 minutes

    if (this.account_locked_until && new Date(this.account_locked_until) < new Date()) {
      return this.update({
        login_attempts: 1,
        account_locked_until: null,
      });
    }

    const updates = { login_attempts: this.login_attempts + 1 };

    if (this.login_attempts + 1 >= maxAttempts && !this.isAccountLocked()) {
      updates.account_locked_until = new Date(Date.now() + lockTime);
    }

    return this.update(updates);
  }

  async resetLoginAttempts() {
    return this.update({
      login_attempts: 0,
      account_locked_until: null,
      last_login_at: new Date(),
    });
  }

  toSafeObject() {
    const {
      password,
      password_reset_token,
      email_verification_token,
      account_locked_until,
      login_attempts,
      ...safeUser
    } = this.toJSON();
    return safeUser;
  }

  // Class methods
  static async findByEmailSafe(email) {
    const user = await this.findByEmail(email);
    return user ? user.toSafeObject() : null;
  }

  static async createUser(userData) {
    const user = await this.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });
    return user.toSafeObject();
  }

  static async getActiveUsers(options = {}) {
    return this.findAll({
      where: { isActive: true },
      ...options,
    });
  }

  static async getUsersByRole(role, options = {}) {
    return this.findAll({
      where: { role, isActive: true },
      ...options,
    });
  }
}

module.exports = User;