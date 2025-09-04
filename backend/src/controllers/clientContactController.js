const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Client Contact Controller
 * Handles CRUD operations for client contacts with role management
 */
class ClientContactController {
  /**
   * Get all contacts for a specific client
   */
  static async getClientContacts(req, res) {
    try {
      const { clientId } = req.params;
      const { 
        role, 
        isActive = true,
        includeInactive = false,
        sortBy = 'is_primary',
        sortOrder = 'DESC',
        limit = 50,
        offset = 0 
      } = req.query;

      const whereClause = { clientId };
      
      // Filter by role if specified
      if (role) {
        whereClause.role = role;
      }

      // Filter by active status
      if (!includeInactive) {
        whereClause.isActive = isActive;
      }

      const contacts = await sequelize.models.ClientContact.findAndCountAll({
        where: whereClause,
        order: [
          [sortBy, sortOrder],
          ['created_at', 'ASC']
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: sequelize.models.Client,
            as: 'client',
            attributes: ['id', 'companyName'],
          }
        ]
      });

      res.json({
        success: true,
        data: {
          contacts: contacts.rows,
          total: contacts.count,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            total: contacts.count,
            pages: Math.ceil(contacts.count / parseInt(limit))
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching client contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch client contacts',
        error: error.message
      });
    }
  }

  /**
   * Get a specific contact by ID
   */
  static async getContactById(req, res) {
    try {
      const { contactId } = req.params;

      const contact = await sequelize.models.ClientContact.findByPk(contactId, {
        include: [
          {
            model: sequelize.models.Client,
            as: 'client',
            attributes: ['id', 'companyName', 'status'],
          }
        ]
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      logger.error('Error fetching contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact',
        error: error.message
      });
    }
  }

  /**
   * Create a new contact for a client
   */
  static async createContact(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { clientId } = req.params;
      const contactData = { ...req.body, clientId };

      // Validate client exists
      const client = await sequelize.models.Client.findByPk(clientId);
      if (!client) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      // If this is being set as primary, make sure no other contact is primary
      if (contactData.isPrimary) {
        await sequelize.models.ClientContact.update(
          { isPrimary: false },
          {
            where: { clientId },
            transaction
          }
        );
      }

      // Check if this is the first contact and auto-set as primary
      const existingContactsCount = await sequelize.models.ClientContact.count({
        where: { clientId, isActive: true }
      });

      if (existingContactsCount === 0) {
        contactData.isPrimary = true;
      }

      const contact = await sequelize.models.ClientContact.create(contactData, {
        transaction
      });

      await transaction.commit();

      // Fetch the created contact with includes
      const createdContact = await sequelize.models.ClientContact.findByPk(contact.id, {
        include: [
          {
            model: sequelize.models.Client,
            as: 'client',
            attributes: ['id', 'companyName'],
          }
        ]
      });

      logger.info(`Contact created for client ${clientId}: ${contact.id}`);

      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: createdContact
      });
    } catch (error) {
      await transaction.rollback();
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'A contact with this email already exists for this client'
        });
      }

      logger.error('Error creating contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create contact',
        error: error.message
      });
    }
  }

  /**
   * Update a contact
   */
  static async updateContact(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { contactId } = req.params;
      const updateData = req.body;

      const contact = await sequelize.models.ClientContact.findByPk(contactId, {
        transaction
      });

      if (!contact) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // If setting as primary, remove primary status from other contacts
      if (updateData.isPrimary && !contact.isPrimary) {
        await sequelize.models.ClientContact.update(
          { isPrimary: false },
          {
            where: { 
              clientId: contact.clientId,
              id: { [sequelize.Sequelize.Op.ne]: contactId }
            },
            transaction
          }
        );
      }

      // If removing primary status, ensure another contact becomes primary
      if (updateData.isPrimary === false && contact.isPrimary) {
        const otherActiveContacts = await sequelize.models.ClientContact.findAll({
          where: {
            clientId: contact.clientId,
            id: { [sequelize.Sequelize.Op.ne]: contactId },
            isActive: true
          },
          transaction
        });

        if (otherActiveContacts.length > 0) {
          // Set the first other active contact as primary
          await otherActiveContacts[0].update({ isPrimary: true }, { transaction });
        }
      }

      await contact.update(updateData, { transaction });
      await transaction.commit();

      // Fetch updated contact with includes
      const updatedContact = await sequelize.models.ClientContact.findByPk(contactId, {
        include: [
          {
            model: sequelize.models.Client,
            as: 'client',
            attributes: ['id', 'companyName'],
          }
        ]
      });

      logger.info(`Contact updated: ${contactId}`);

      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: updatedContact
      });
    } catch (error) {
      await transaction.rollback();
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      logger.error('Error updating contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact',
        error: error.message
      });
    }
  }

  /**
   * Delete a contact (soft delete)
   */
  static async deleteContact(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { contactId } = req.params;

      const contact = await sequelize.models.ClientContact.findByPk(contactId, {
        transaction
      });

      if (!contact) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // If deleting primary contact, set another active contact as primary
      if (contact.isPrimary) {
        const otherActiveContacts = await sequelize.models.ClientContact.findAll({
          where: {
            clientId: contact.clientId,
            id: { [sequelize.Sequelize.Op.ne]: contactId },
            isActive: true
          },
          transaction
        });

        if (otherActiveContacts.length > 0) {
          await otherActiveContacts[0].update({ isPrimary: true }, { transaction });
        }
      }

      // Soft delete
      await contact.update({ isActive: false }, { transaction });
      await transaction.commit();

      logger.info(`Contact soft deleted: ${contactId}`);

      res.json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete contact',
        error: error.message
      });
    }
  }

  /**
   * Set a contact as primary
   */
  static async setPrimaryContact(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { contactId } = req.params;

      const contact = await sequelize.models.ClientContact.findByPk(contactId, {
        transaction
      });

      if (!contact) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      if (!contact.isActive) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Cannot set inactive contact as primary'
        });
      }

      // Use the model's static method
      await sequelize.models.ClientContact.setPrimaryContact(contactId, transaction);
      await transaction.commit();

      // Fetch updated contact
      const updatedContact = await sequelize.models.ClientContact.findByPk(contactId, {
        include: [
          {
            model: sequelize.models.Client,
            as: 'client',
            attributes: ['id', 'companyName'],
          }
        ]
      });

      logger.info(`Primary contact set: ${contactId}`);

      res.json({
        success: true,
        message: 'Primary contact updated successfully',
        data: updatedContact
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error setting primary contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to set primary contact',
        error: error.message
      });
    }
  }

  /**
   * Get contacts by role
   */
  static async getContactsByRole(req, res) {
    try {
      const { clientId, role } = req.params;

      const contacts = await sequelize.models.ClientContact.findByRole(clientId, role);

      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      logger.error('Error fetching contacts by role:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts by role',
        error: error.message
      });
    }
  }

  /**
   * Get primary contact for a client
   */
  static async getPrimaryContact(req, res) {
    try {
      const { clientId } = req.params;

      const contact = await sequelize.models.ClientContact.findPrimaryContact(clientId);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'No primary contact found for this client'
        });
      }

      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      logger.error('Error fetching primary contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch primary contact',
        error: error.message
      });
    }
  }
}

module.exports = ClientContactController;