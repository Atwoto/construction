const express = require('express');
const { body, param, query } = require('express-validator');
const ClientContactController = require('../controllers/clientContactController');
const { authenticate } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientContact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: Contact ID
 *         clientId:
 *           type: integer
 *           description: Client ID this contact belongs to
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Contact first name
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Contact last name
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Job title
 *         department:
 *           type: string
 *           maxLength: 100
 *           description: Department
 *         role:
 *           type: string
 *           enum: [primary, billing, technical, decision_maker, project_coordinator, finance, legal, operations, other]
 *           description: Contact role
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email
 *         phone:
 *           type: string
 *           description: Phone number
 *         mobilePhone:
 *           type: string
 *           description: Mobile phone number
 *         extension:
 *           type: string
 *           maxLength: 10
 *           description: Phone extension
 *         isPrimary:
 *           type: boolean
 *           description: Whether this is the primary contact
 *         isActive:
 *           type: boolean
 *           description: Whether the contact is active
 *         preferredContactMethod:
 *           type: string
 *           enum: [email, phone, mobile, text]
 *           description: Preferred contact method
 *         timezone:
 *           type: string
 *           description: Contact timezone
 *         notes:
 *           type: string
 *           description: Additional notes
 *         socialMedia:
 *           type: object
 *           description: Social media profiles
 *         lastContactDate:
 *           type: string
 *           format: date
 *           description: Last contact date
 *         nextFollowUpDate:
 *           type: string
 *           format: date
 *           description: Next follow-up date
 *         birthday:
 *           type: string
 *           format: date
 *           description: Contact birthday
 *         workAnniversary:
 *           type: string
 *           format: date
 *           description: Work anniversary
 */

// Validation rules
const contactValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('role')
    .isIn(['primary', 'billing', 'technical', 'decision_maker', 'project_coordinator', 'finance', 'legal', 'operations', 'other'])
    .withMessage('Invalid role specified'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Must be a valid phone number'),
  body('mobilePhone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Must be a valid mobile phone number'),
  body('extension')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Extension must be less than 10 characters'),
  body('isPrimary')
    .optional()
    .isBoolean()
    .withMessage('isPrimary must be a boolean'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('preferredContactMethod')
    .optional()
    .isIn(['email', 'phone', 'mobile', 'text'])
    .withMessage('Invalid preferred contact method'),
  body('timezone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Timezone must be less than 50 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must be less than 2000 characters'),
  body('socialMedia')
    .optional()
    .isObject()
    .withMessage('Social media must be an object'),
  body('lastContactDate')
    .optional()
    .isISO8601()
    .withMessage('Last contact date must be a valid date'),
  body('nextFollowUpDate')
    .optional()
    .isISO8601()
    .withMessage('Next follow-up date must be a valid date'),
  body('birthday')
    .optional()
    .isDate()
    .withMessage('Birthday must be a valid date'),
  body('workAnniversary')
    .optional()
    .isDate()
    .withMessage('Work anniversary must be a valid date'),
];

const clientIdValidation = [
  param('clientId')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer'),
];

const contactIdValidation = [
  param('contactId')
    .isInt({ min: 1 })
    .withMessage('Contact ID must be a positive integer'),
];

/**
 * @swagger
 * /api/clients/{clientId}/contacts:
 *   get:
 *     summary: Get all contacts for a client
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [primary, billing, technical, decision_maker, project_coordinator, finance, legal, operations, other]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Include inactive contacts
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: is_primary
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Limit results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset results
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:clientId/contacts',
  authenticate,
  clientIdValidation,
  validateRequest,
  ClientContactController.getClientContacts
);

/**
 * @swagger
 * /api/clients/{clientId}/contacts:
 *   post:
 *     summary: Create a new contact for a client
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientContact'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:clientId/contacts',
  authenticate,
  clientIdValidation,
  contactValidation,
  validateRequest,
  ClientContactController.createContact
);

/**
 * @swagger
 * /api/clients/{clientId}/contacts/primary:
 *   get:
 *     summary: Get primary contact for a client
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Primary contact retrieved successfully
 *       404:
 *         description: No primary contact found
 *       500:
 *         description: Server error
 */
router.get(
  '/:clientId/contacts/primary',
  authenticate,
  clientIdValidation,
  validateRequest,
  ClientContactController.getPrimaryContact
);

/**
 * @swagger
 * /api/clients/{clientId}/contacts/role/{role}:
 *   get:
 *     summary: Get contacts by role for a client
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [primary, billing, technical, decision_maker, project_coordinator, finance, legal, operations, other]
 *         description: Contact role
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
  '/:clientId/contacts/role/:role',
  authenticate,
  clientIdValidation,
  [
    param('role')
      .isIn(['primary', 'billing', 'technical', 'decision_maker', 'project_coordinator', 'finance', 'legal', 'operations', 'other'])
      .withMessage('Invalid role specified')
  ],
  validateRequest,
  ClientContactController.getContactsByRole
);

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   get:
 *     summary: Get a specific contact by ID
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.get(
  '/contacts/:contactId',
  authenticate,
  contactIdValidation,
  validateRequest,
  ClientContactController.getContactById
);

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   put:
 *     summary: Update a contact
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientContact'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.put(
  '/contacts/:contactId',
  authenticate,
  contactIdValidation,
  contactValidation,
  validateRequest,
  ClientContactController.updateContact
);

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   delete:
 *     summary: Delete a contact (soft delete)
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/contacts/:contactId',
  authenticate,
  contactIdValidation,
  validateRequest,
  ClientContactController.deleteContact
);

/**
 * @swagger
 * /api/contacts/{contactId}/set-primary:
 *   post:
 *     summary: Set a contact as primary
 *     tags: [Client Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Primary contact updated successfully
 *       400:
 *         description: Cannot set inactive contact as primary
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.post(
  '/contacts/:contactId/set-primary',
  authenticate,
  contactIdValidation,
  validateRequest,
  ClientContactController.setPrimaryContact
);

module.exports = router;