const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Document model for Supabase
 */
class Document extends BaseModel {
  constructor(data) {
    super(data, 'documents');
  }

  // Instance methods
  async updateVersion(newVersion) {
    return this.update({ 
      version: newVersion,
      updated_at: new Date().toISOString()
    });
  }

  // Class methods
  static async getByProject(projectId, options = {}) {
    return this.findAll({
      where: { project_id: projectId },
      ...options,
    }, 'documents');
  }

  static async getByClient(clientId, options = {}) {
    return this.findAll({
      where: { client_id: clientId },
      ...options,
    }, 'documents');
  }

  static async getByCategory(category, options = {}) {
    return this.findAll({
      where: { category },
      ...options,
    }, 'documents');
  }

  static async searchDocuments(searchTerm, options = {}) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .or(`file_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError.internal('Database error', error);
    }

    return data.map(document => new Document(document));
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'projectId': 'project_id',
      'clientId': 'client_id',
      'uploadedBy': 'uploaded_by',
      'fileName': 'file_name',
      'fileType': 'file_type',
      'fileSize': 'file_size',
      'storagePath': 'storage_path',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Document;