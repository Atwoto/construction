const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  updateLastContact,
  setNextFollowUp,
  getClientStats,
  getClientsForSelect,
  addTag,
  removeTag,
} = require('../controllers/clientController');

const router = express.Router();

// Validation rules for client creation and updates
const clientValidationRules = [
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters'),
  
  body('contactPerson')
    .notEmpty()
    .withMessage('Contact person is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Contact person must be between 1 and 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Must be a valid phone number'),
  
  body('alternatePhone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Must be a valid phone number'),
  
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  
  body('city')
    .notEmpty()
    .withMessage('City is required'),
  
  body('state')
    .notEmpty()
    .withMessage('State is required'),
  
  body('zipCode')
    .notEmpty()
    .withMessage('Zip code is required'),
  
  body('country')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Country must be between 1 and 100 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Must be a valid URL'),
  
  body('industry')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Industry must be less than 100 characters'),
  
  body('companySize')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '500+'])
    .withMessage('Invalid company size'),
  
  body('status')
    .optional()
    .isIn(['lead', 'opportunity', 'active', 'inactive', 'lost'])
    .withMessage('Invalid status'),
  
  body('source')
    .optional()
    .isIn(['website', 'referral', 'cold_call', 'email', 'social_media', 'advertisement', 'trade_show', 'other'])
    .withMessage('Invalid source'),
  
  body('assignedTo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Assigned user must be a valid user ID'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('estimatedValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated value must be a positive number'),
  
  body('notes')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Notes must be less than 5000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  body('lastContactDate')
    .optional()
    .isISO8601()
    .withMessage('Last contact date must be a valid date'),
  
  body('nextFollowUpDate')
    .optional()
    .isISO8601()
    .withMessage('Next follow-up date must be a valid date'),
  
  body('preferredContactMethod')
    .optional()
    .isIn(['email', 'phone', 'text', 'in_person'])
    .withMessage('Invalid preferred contact method'),
  
  body('timezone')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Timezone must be between 1 and 50 characters'),
];

// Validation rules for updating client status
const statusValidationRules = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['lead', 'opportunity', 'active', 'inactive', 'lost'])
    .withMessage('Invalid status'),
  
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason must be less than 500 characters'),
];

// Validation rules for follow-up date
const followUpValidationRules = [
  body('nextFollowUpDate')
    .notEmpty()
    .withMessage('Next follow-up date is required')
    .isISO8601()
    .withMessage('Next follow-up date must be a valid date'),
];

// Validation rules for tags
const tagValidationRules = [
  body('tag')
    .notEmpty()
    .withMessage('Tag is required')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag must be between 1 and 50 characters'),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - companyName
 *         - contactPerson
 *         - email
 *         - phone
 *         - address
 *         - city
 *         - state
 *         - zipCode
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the client
 *         companyName:
 *           type: string
 *           description: Name of the client company
 *         contactPerson:
 *           type: string
 *           description: Primary contact person
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         phone:
 *           type: string
 *           description: Primary phone number
 *         alternatePhone:
 *           type: string
 *           description: Alternate phone number
 *         address:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City
 *         state:
 *           type: string
 *           description: State or province
 *         zipCode:
 *           type: string
 *           description: ZIP or postal code
 *         country:
 *           type: string
 *           description: Country name
 *         website:
 *           type: string
 *           format: url
 *           description: Company website
 *         industry:
 *           type: string
 *           description: Industry or business sector
 *         companySize:
 *           type: string
 *           enum: ['1-10', '11-50', '51-200', '201-500', '500+']
 *           description: Company size category
 *         status:
 *           type: string
 *           enum: ['lead', 'opportunity', 'active', 'inactive', 'lost']
 *           description: Client status
 *         source:
 *           type: string
 *           enum: ['website', 'referral', 'cold_call', 'email', 'social_media', 'advertisement', 'trade_show', 'other']
 *           description: How the client was acquired
 *         assignedTo:
 *           type: integer
 *           description: ID of assigned user
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Client rating (1-5 stars)
 *         estimatedValue:
 *           type: number
 *           description: Estimated value of the client
 *         notes:
 *           type: string
 *           description: Additional notes about the client
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the client
 *         lastContactDate:
 *           type: string
 *           format: date-time
 *           description: Date of last contact
 *         nextFollowUpDate:
 *           type: string
 *           format: date-time
 *           description: Date for next follow-up
 *         preferredContactMethod:
 *           type: string
 *           enum: ['email', 'phone', 'text', 'in_person']
 *           description: Preferred method of contact
 *         timezone:
 *           type: string
 *           description: Client timezone
 */

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients with filtering and pagination
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of clients per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for company name, contact person, email, or phone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [lead, opportunity, active, inactive, lost]
 *         description: Filter by client status
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by client source
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of clients retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, getClients);

/**
 * @swagger
 * /api/clients/stats:
 *   get:
 *     summary: Get client statistics
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/stats', authenticate, getClientStats);

/**
 * @swagger
 * /api/clients/select:
 *   get:
 *     summary: Get clients for dropdown selection
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering clients
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by status (default [active, opportunity])
 *     responses:
 *       200:
 *         description: Clients for selection retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/select', authenticate, getClientsForSelect);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client retrieved successfully
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getClientById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, clientValidationRules, createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, clientValidationRules, updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       400:
 *         description: Cannot delete client with active projects
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorize('admin', 'manager'), deleteClient);

/**
 * @swagger
 * /api/clients/{id}/status:
 *   patch:
 *     summary: Update client status
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [lead, opportunity, active, inactive, lost]
 *               reason:
 *                 type: string
 *                 description: Reason for status change (required for 'lost' status)
 *     responses:
 *       200:
 *         description: Client status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/status', authenticate, statusValidationRules, updateClientStatus);

/**
 * @swagger
 * /api/clients/{id}/contact:
 *   patch:
 *     summary: Update last contact date
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Last contact date updated successfully
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/contact', authenticate, updateLastContact);

/**
 * @swagger
 * /api/clients/{id}/follow-up:
 *   patch:
 *     summary: Set next follow-up date
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nextFollowUpDate
 *             properties:
 *               nextFollowUpDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Next follow-up date set successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/follow-up', authenticate, followUpValidationRules, setNextFollowUp);

/**
 * @swagger
 * /api/clients/{id}/tags:
 *   post:
 *     summary: Add tag to client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag
 *             properties:
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/:id/tags', authenticate, tagValidationRules, addTag);

/**
 * @swagger
 * /api/clients/{id}/tags:
 *   delete:
 *     summary: Remove tag from client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag
 *             properties:
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag removed successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id/tags', authenticate, tagValidationRules, removeTag);

module.exports = router;