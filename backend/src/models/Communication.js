const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Communication model for Supabase
 */
class Communication extends BaseModel {
  constructor(data) {
    super(data, 'communications');
  }

  // Class methods
  static async getByClient(clientId, options = {}) {
    return this.findAll({
      where: { client_id: clientId },
      ...options,
    }, 'communications');
  }

  static async getByProject(projectId, options = {}) {
    return this.findAll({
      where: { project_id: projectId },
      ...options,
    }, 'communications');
  }

  static async getByUser(userId, options = {}) {
    return this.findAll({
      where: { user_id: userId },
      ...options,
    }, 'communications');
  }

  static async getByType(type, options = {}) {
    return this.findAll({
      where: { type },
      ...options,
    }, 'communications');
  }

  static async getRecentCommunications(limit = 50, options = {}) {
    return this.findAll({
      ...options,
      order: ['created_at', 'desc'],
      limit: limit
    }, 'communications');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'userId': 'user_id',
      'clientId': 'client_id',
      'projectId': 'project_id',
      'relatedTo': 'related_to',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Communication;