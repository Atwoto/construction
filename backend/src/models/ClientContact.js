const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * ClientContact model for Supabase
 */
class ClientContact extends BaseModel {
  constructor(data) {
    super(data, 'client_contacts');
  }

  // Instance methods
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  // Class methods
  static async getByClient(clientId, options = {}) {
    return this.findAll({
      where: { client_id: clientId },
      ...options,
    }, 'client_contacts');
  }

  static async getPrimaryContact(clientId, options = {}) {
    return this.findOne({
      where: { 
        client_id: clientId,
        is_primary: true
      },
      ...options,
    }, 'client_contacts');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'clientId': 'client_id',
      'firstName': 'first_name',
      'lastName': 'last_name',
      'isPrimary': 'is_primary',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = ClientContact;