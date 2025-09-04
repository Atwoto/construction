const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Supplier model for Supabase
 */
class Supplier extends BaseModel {
  constructor(data) {
    super(data, 'suppliers');
  }

  // Instance methods
  getFullAddress() {
    return `${this.address}, ${this.city}, ${this.state} ${this.zip_code}, ${this.country}`;
  }

  // Class methods
  static async searchSuppliers(searchTerm, options = {}) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .or(`company_name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError.internal('Database error', error);
    }

    return data.map(supplier => new Supplier(supplier));
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'companyName': 'company_name',
      'contactPerson': 'contact_person',
      'alternatePhone': 'alternate_phone',
      'zipCode': 'zip_code',
      'paymentTerms': 'payment_terms',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Supplier;