const Employee = require('../models/Employee');
const User = require('../models/User');
const { supabase } = require('../config/supabase');
const { createError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all employees with filtering, sorting, and pagination
 */
const getEmployees = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      employmentType,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    let query = supabase
      .from('employees')
      .select(`
        *,
        user:users!user_id(id, first_name, last_name, email)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) query = query.eq('status', status);
    if (department) query = query.eq('department', department);
    if (employmentType) query = query.eq('employment_type', employmentType);

    // Search filter
    if (search) {
      query = query.or(`employee_id.ilike.%${search}%,position.ilike.%${search}%`);
    }

    // Apply sorting
    const validSortFields = [
      'employee_id',
      'position',
      'department',
      'employment_type',
      'hire_date',
      'created_at'
    ];

    const orderField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) 
      ? sortOrder.toLowerCase() 
      : 'desc';

    query = query.order(orderField, { ascending: orderDirection === 'asc' });

    const { data: employees, count, error } = await query;

    if (error) {
      throw createError.internal('Error fetching employees', error);
    }

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.json({
      employees,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEmployees: count,
        hasNext,
        hasPrev,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching employees:', error);
    throw error;
  }
});

/**
 * Get employee by ID
 */
const getEmployeeById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { data: employee, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!user_id(id, first_name, last_name, email, phone, address)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError.notFound('Employee not found');
      }
      throw createError.internal('Error fetching employee', error);
    }

    res.json(employee);
  } catch (error) {
    logger.error('Error fetching employee:', error);
    throw error;
  }
});

/**
 * Create new employee
 */
const createEmployee = asyncHandler(async (req, res) => {
  try {
    const employeeData = req.body;

    // Validate user exists
    const user = await User.findByPk(employeeData.user_id);
    if (!user) {
      throw createError.notFound('User not found');
    }

    const employee = await Employee.create(employeeData);

    // Fetch the created employee with user
    const { data: createdEmployee, error: fetchError } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!user_id(id, first_name, last_name, email)
      `)
      .eq('id', employee.id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching created employee', fetchError);
    }

    res.status(201).json(createdEmployee);
  } catch (error) {
    logger.error('Error creating employee:', error);
    throw error;
  }
});

/**
 * Update employee
 */
const updateEmployee = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw createError.notFound('Employee not found');
    }

    await employee.update(updateData);

    // Fetch updated employee with user
    const { data: updatedEmployee, error: fetchError } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!user_id(id, first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated employee', fetchError);
    }

    res.json(updatedEmployee);
  } catch (error) {
    logger.error('Error updating employee:', error);
    throw error;
  }
});

/**
 * Delete employee
 */
const deleteEmployee = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw createError.notFound('Employee not found');
    }

    await employee.delete();

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    logger.error('Error deleting employee:', error);
    throw error;
  }
});

/**
 * Add skill to employee
 */
const addSkill = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { skill } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw createError.notFound('Employee not found');
    }

    await employee.addSkill(skill);

    const { data: updatedEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated employee', fetchError);
    }

    res.json({
      message: 'Skill added successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    logger.error('Error adding skill:', error);
    throw error;
  }
});

/**
 * Remove skill from employee
 */
const removeSkill = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { skill } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw createError.notFound('Employee not found');
    }

    await employee.removeSkill(skill);

    const { data: updatedEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated employee', fetchError);
    }

    res.json({
      message: 'Skill removed successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    logger.error('Error removing skill:', error);
    throw error;
  }
});

/**
 * Add certification to employee
 */
const addCertification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const certification = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw createError.notFound('Employee not found');
    }

    await employee.addCertification(certification);

    const { data: updatedEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated employee', fetchError);
    }

    res.json({
      message: 'Certification added successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    logger.error('Error adding certification:', error);
    throw error;
  }
});

/**
 * Use time off
 */
const useTimeOff = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { type, days } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw createError.notFound('Employee not found');
    }

    await employee.useTimeOff(type, days);

    const { data: updatedEmployee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated employee', fetchError);
    }

    res.json({
      message: 'Time off used successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    logger.error('Error using time off:', error);
    throw error;
  }
});

/**
 * Get employee statistics
 */
const getEmployeeStats = asyncHandler(async (req, res) => {
  try {
    const stats = await Employee.getEmployeeStats();

    // Get upcoming reviews
    const { data: upcomingReviews, error: reviewsError } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!user_id(first_name, last_name, email)
      `)
      .lte('next_review_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()) // 30 days from now
      .eq('status', 'active')
      .order('next_review_date', { ascending: true });

    if (reviewsError) {
      throw createError.internal('Error getting upcoming reviews', reviewsError);
    }

    res.json({
      ...stats,
      upcomingReviews
    });
  } catch (error) {
    logger.error('Error fetching employee statistics:', error);
    throw error;
  }
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  addSkill,
  removeSkill,
  addCertification,
  useTimeOff,
  getEmployeeStats,
};