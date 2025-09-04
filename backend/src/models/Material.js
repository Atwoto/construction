const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Material model for Supabase
 */
class Material extends BaseModel {
  constructor(data) {
    super(data, 'materials');
  }

  // Instance methods
  async updateStock(quantity) {
    const newStock = (this.current_stock || 0) + quantity;
    return this.update({ 
      current_stock: Math.max(0, newStock),
      updated_at: new Date().toISOString()
    });
  }

  isLowStock() {
    return (this.current_stock || 0) <= (this.min_stock_level || 0);
  }

  needsReorder() {
    return (this.current_stock || 0) <= (this.reorder_point || 0);
  }

  // Class methods
  static async getByCategory(category, options = {}) {
    return this.findAll({
      where: { category },
      ...options,
    }, 'materials');
  }

  static async getBySupplier(supplierId, options = {}) {
    return this.findAll({
      where: { supplier_id: supplierId },
      ...options,
    }, 'materials');
  }

  static async getLowStockMaterials(options = {}) {
    return this.findAll({
      where: {
        current_stock: { lte: 'min_stock_level' } // This would need special handling in Supabase
      },
      ...options,
    }, 'materials');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'supplierId': 'supplier_id',
      'unitPrice': 'unit_price',
      'minStockLevel': 'min_stock_level',
      'currentStock': 'current_stock',
      'reorderPoint': 'reorder_point',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Material;