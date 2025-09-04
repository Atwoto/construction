const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');

/**
 * Base model class for Supabase
 */
class BaseModel {
  constructor(data, tableName) {
    this.tableName = tableName;
    Object.assign(this, data);
  }

  // Static methods that should be available on all models
  static async findByPk(id, tableName) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw createError.internal('Database error', error);
    }

    return new this(data);
  }

  static async findOne(options, tableName) {
    const { where } = options;
    let query = supabase.from(tableName).select('*');

    // Apply filters
    for (const [key, value] of Object.entries(where)) {
      const mappedKey = this.mapFieldName(key);
      if (typeof value === 'object' && value !== null) {
        // Handle operators
        const operator = Object.keys(value)[0];
        const operand = value[operator];
        
        switch (operator) {
          case 'lt':
            const ltValue = operand instanceof Date ? operand.toISOString() : operand;
            query = query.lt(mappedKey, ltValue);
            break;
          case 'gt':
            const gtValue = operand instanceof Date ? operand.toISOString() : operand;
            query = query.gt(mappedKey, gtValue);
            break;
          case 'lte':
            const lteValue = operand instanceof Date ? operand.toISOString() : operand;
            query = query.lte(mappedKey, lteValue);
            break;
          case 'gte':
            const gteValue = operand instanceof Date ? operand.toISOString() : operand;
            query = query.gte(mappedKey, gteValue);
            break;
          case 'in':
            query = query.in(mappedKey, operand);
            break;
          case 'notIn':
            // Supabase uses not.in() for notIn operator with parentheses
            query = query.not(mappedKey, 'in', `(${operand.join(',')})`);
            break;
          case 'iLike':
            // Supabase doesn't have iLike, using ilike
            query = query.ilike(mappedKey, operand.replace(/%/g, ''));
            break;
          default:
            query = query.eq(mappedKey, operand);
        }
      } else {
        query = query.eq(mappedKey, value);
      }
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw createError.internal('Database error', error);
    }

    return new this(data);
  }

  static async findAll(options = {}, tableName) {
    let query = supabase.from(tableName).select('*');

    // Apply where conditions
    if (options.where) {
      const { where } = options;
      for (const [key, value] of Object.entries(where)) {
        const mappedKey = this.mapFieldName(key);
        if (typeof value === 'object' && value !== null) {
          // Handle operators
          const operator = Object.keys(value)[0];
          const operand = value[operator];
          
          switch (operator) {
            case 'lt':
              const ltValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.lt(mappedKey, ltValue);
              break;
            case 'gt':
              const gtValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.gt(mappedKey, gtValue);
              break;
            case 'lte':
              const lteValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.lte(mappedKey, lteValue);
              break;
            case 'gte':
              const gteValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.gte(mappedKey, gteValue);
              break;
            case 'in':
              query = query.in(mappedKey, operand);
              break;
            case 'notIn':
              // Supabase uses not.in() for notIn operator with parentheses
              query = query.not(mappedKey, 'in', `(${operand.join(',')})`);
              break;
            case 'iLike':
              // Supabase doesn't have iLike, using ilike
              query = query.ilike(mappedKey, operand.replace(/%/g, ''));
              break;
            default:
              query = query.eq(mappedKey, operand);
          }
        } else {
          query = query.eq(mappedKey, value);
        }
      }
    }

    // Apply ordering if specified
    if (options.order) {
      const [field, direction] = options.order;
      query = query.order(this.mapFieldName(field), { ascending: direction.toLowerCase() === 'asc' });
    }

    // Apply limit if specified
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw createError.internal('Database error', error);
    }

    return data.map(item => new this(item));
  }

  static async count(options = {}, tableName) {
    let query = supabase.from(tableName).select('*', { count: 'exact', head: true });

    // Apply where conditions
    if (options.where) {
      const { where } = options;
      for (const [key, value] of Object.entries(where)) {
        const mappedKey = this.mapFieldName(key);
        if (typeof value === 'object' && value !== null) {
          // Handle operators
          const operator = Object.keys(value)[0];
          const operand = value[operator];
          
          switch (operator) {
            case 'lt':
              const ltValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.lt(mappedKey, ltValue);
              break;
            case 'gt':
              const gtValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.gt(mappedKey, gtValue);
              break;
            case 'lte':
              const lteValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.lte(mappedKey, lteValue);
              break;
            case 'gte':
              const gteValue = operand instanceof Date ? operand.toISOString() : operand;
              query = query.gte(mappedKey, gteValue);
              break;
            case 'in':
              query = query.in(mappedKey, operand);
              break;
            case 'notIn':
              query = query.not(mappedKey, 'in', `(${operand.join(',')})`);
              break;
            case 'between':
              const betweenStart = operand[0] instanceof Date ? operand[0].toISOString() : operand[0];
              const betweenEnd = operand[1] instanceof Date ? operand[1].toISOString() : operand[1];
              query = query.gte(mappedKey, betweenStart);
              query = query.lte(mappedKey, betweenEnd);
              break;
            default:
              query = query.eq(mappedKey, operand);
          }
        } else {
          query = query.eq(mappedKey, value);
        }
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error('Supabase count error:', error);
      throw createError.internal('Database error: ' + (error.message || JSON.stringify(error)), error);
    }

    return count;
  }

  static async create(data, tableName) {
    const insertData = this.mapFieldNames(data);
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select()
      .single();

    if (error) {
      throw createError.internal('Database error', error);
    }

    return new this(result);
  }

  // Instance methods
  toJSON() {
    return { ...this };
  }

  async update(updates) {
    const updateData = this.constructor.mapFieldNames(updates);

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', this.id)
      .select()
      .single();

    if (error) {
      throw createError.internal('Database error', error);
    }

    // Update current instance
    Object.assign(this, data);
    return this;
  }

  async delete() {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', this.id);

    if (error) {
      throw createError.internal('Database error', error);
    }

    return true;
  }

  // Helper methods for field mapping (to be overridden by subclasses)
  static mapFieldName(fieldName) {
    return fieldName;
  }

  static mapFieldNames(obj) {
    if (!obj) return obj;
    
    const mapped = {};
    for (const [key, value] of Object.entries(obj)) {
      mapped[this.mapFieldName(key)] = value;
    }
    return mapped;
  }
}

module.exports = BaseModel;