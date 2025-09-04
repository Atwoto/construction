const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Expense model for Supabase
 */
class Expense extends BaseModel {
  constructor(data) {
    super(data, 'expenses');
  }

  // Instance methods
  getTotalAmount() {
    return this.amount || 0;
  }

  // Class methods
  static async getByProject(projectId, options = {}) {
    return this.findAll({
      where: { project_id: projectId },
      ...options,
    }, 'expenses');
  }

  static async getByCategory(categoryId, options = {}) {
    return this.findAll({
      where: { category_id: categoryId },
      ...options,
    }, 'expenses');
  }

  static async getByStatus(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options,
    }, 'expenses');
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
    }, 'expenses');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'projectId': 'project_id',
      'categoryId': 'category_id',
      'receiptUrl': 'receipt_url',
      'approvedBy': 'approved_by',
      'approvedAt': 'approved_at',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Expense;