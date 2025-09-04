const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Timesheet model for Supabase
 */
class Timesheet extends BaseModel {
  constructor(data) {
    super(data, 'timesheets');
  }

  // Instance methods
  getTotalHours() {
    return this.hours || 0;
  }

  // Class methods
  static async getByEmployee(employeeId, options = {}) {
    return this.findAll({
      where: { employee_id: employeeId },
      ...options,
    }, 'timesheets');
  }

  static async getByProject(projectId, options = {}) {
    return this.findAll({
      where: { project_id: projectId },
      ...options,
    }, 'timesheets');
  }

  static async getByTask(taskId, options = {}) {
    return this.findAll({
      where: { task_id: taskId },
      ...options,
    }, 'timesheets');
  }

  static async getByDateRange(startDate, endDate, options = {}) {
    return this.findAll({
      where: {
        date: { 
          gte: startDate,
          lte: endDate
        }
      },
      ...options,
    }, 'timesheets');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'employeeId': 'employee_id',
      'projectId': 'project_id',
      'taskId': 'task_id',
      'approvedBy': 'approved_by',
      'approvedAt': 'approved_at',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Timesheet;