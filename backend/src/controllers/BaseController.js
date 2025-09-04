const { createError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Base controller class
 */
class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Get all records with pagination and filtering
  getAll = asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'desc',
        ...filters
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build query
      let query = this.model.findAll({
        ...filters,
        order: [sortBy, sortOrder.toUpperCase()],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const records = await query;
      const count = await this.model.count(filters);

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          records,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalRecords: count,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      logger.error(`Get all ${this.model.name} error:`, error);
      throw error;
    }
  });

  // Get record by ID
  getById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const record = await this.model.findByPk(id);
      
      if (!record) {
        throw createError.notFound(`${this.model.name} not found`);
      }

      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      logger.error(`Get ${this.model.name} by ID error:`, error);
      throw error;
    }
  });

  // Create new record
  create = asyncHandler(async (req, res) => {
    try {
      const record = await this.model.create(req.body);

      res.status(201).json({
        success: true,
        message: `${this.model.name} created successfully`,
        data: record
      });
    } catch (error) {
      logger.error(`Create ${this.model.name} error:`, error);
      throw error;
    }
  });

  // Update record
  update = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const record = await this.model.findByPk(id);
      if (!record) {
        throw createError.notFound(`${this.model.name} not found`);
      }

      await record.update(req.body);

      res.json({
        success: true,
        message: `${this.model.name} updated successfully`,
        data: record
      });
    } catch (error) {
      logger.error(`Update ${this.model.name} error:`, error);
      throw error;
    }
  });

  // Delete record
  delete = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const record = await this.model.findByPk(id);
      if (!record) {
        throw createError.notFound(`${this.model.name} not found`);
      }

      await record.delete();

      res.json({
        success: true,
        message: `${this.model.name} deleted successfully`
      });
    } catch (error) {
      logger.error(`Delete ${this.model.name} error:`, error);
      throw error;
    }
  });
}

module.exports = BaseController;