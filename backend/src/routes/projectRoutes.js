const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorize, canAccessProject } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - startDate
 *         - estimatedEndDate
 *         - address
 *         - city
 *         - state
 *         - zipCode
 *         - budget
 *         - clientId
 *         - projectManagerId
 *       properties:
 *         id:
 *           type: integer
 *           description: Project ID
 *         name:
 *           type: string
 *           description: Project name
 *         description:
 *           type: string
 *           description: Project description
 *         projectNumber:
 *           type: string
 *           description: Unique project number
 *         type:
 *           type: string
 *           enum: [residential, commercial, industrial, infrastructure, renovation, maintenance]
 *           description: Project type
 *         status:
 *           type: string
 *           enum: [planning, approved, in_progress, on_hold, completed, cancelled]
 *           description: Project status
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           description: Project priority
 *         startDate:
 *           type: string
 *           format: date
 *           description: Project start date
 *         estimatedEndDate:
 *           type: string
 *           format: date
 *           description: Estimated project completion date
 *         actualEndDate:
 *           type: string
 *           format: date
 *           description: Actual project completion date
 *         address:
 *           type: string
 *           description: Project address
 *         city:
 *           type: string
 *           description: Project city
 *         state:
 *           type: string
 *           description: Project state
 *         zipCode:
 *           type: string
 *           description: Project zip code
 *         budget:
 *           type: number
 *           format: decimal
 *           description: Project budget
 *         actualCost:
 *           type: number
 *           format: decimal
 *           description: Actual project cost
 *         estimatedRevenue:
 *           type: number
 *           format: decimal
 *           description: Estimated project revenue
 *         actualRevenue:
 *           type: number
 *           format: decimal
 *           description: Actual project revenue
 *         progress:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Project progress percentage
 *         clientId:
 *           type: integer
 *           description: Client ID
 *         projectManagerId:
 *           type: integer
 *           description: Project manager user ID
 *         contractorId:
 *           type: integer
 *           description: Contractor user ID
 *         notes:
 *           type: string
 *           description: Project notes
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Project tags
 *         teamMembers:
 *           type: array
 *           items:
 *             type: integer
 *           description: Team member user IDs
 *         riskLevel:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Project risk level
 *         weatherDependency:
 *           type: boolean
 *           description: Whether project depends on weather
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of projects per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by project status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by project type
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by project priority
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         description: Filter by client ID
 *       - in: query
 *         name: projectManagerId
 *         schema:
 *           type: integer
 *         description: Filter by project manager ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in project name, number, description, address
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
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *                     pagination:
 *                       type: object
 *       500:
 *         description: Server error
 */
router.get('/', projectController.getAllProjects);

/**
 * @swagger
 * /api/projects/stats:
 *   get:
 *     summary: Get project statistics
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Project statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/stats', authenticate, projectController.getProjectStats);

/**
 * @swagger
 * /api/projects/overdue:
 *   get:
 *     summary: Get overdue projects
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue projects retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/overdue', authenticate, projectController.getOverdueProjects);

/**
 * @swagger
 * /api/projects/status/{status}:
 *   get:
 *     summary: Get projects by status
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Project status
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/status/:status', projectController.getProjectsByStatus);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id', canAccessProject, projectController.getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', authorize('admin', 'manager'), projectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/:id', authorize('admin', 'manager'), canAccessProject, projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}/status:
 *   patch:
 *     summary: Update project status
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [planning, approved, in_progress, on_hold, completed, cancelled]
 *     responses:
 *       200:
 *         description: Project status updated successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', authorize('admin', 'manager'), canAccessProject, projectController.updateProjectStatus);

/**
 * @swagger
 * /api/projects/{id}/progress:
 *   patch:
 *     summary: Update project progress
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Project progress updated successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid progress value
 *       500:
 *         description: Server error
 */
router.patch('/:id/progress', authorize('admin', 'manager'), canAccessProject, projectController.updateProjectProgress);

/**
 * @swagger
 * /api/projects/{id}/team:
 *   post:
 *     summary: Add team member to project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Team member added successfully
 *       404:
 *         description: Project or user not found
 *       500:
 *         description: Server error
 */
router.post('/:id/team-members', authorize('admin', 'manager'), canAccessProject, projectController.addTeamMember);

/**
 * @swagger
 * /api/projects/{id}/team/{userId}:
 *   delete:
 *     summary: Remove team member from project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Team member removed successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/team-members/:userId', authorize('admin', 'manager'), canAccessProject, projectController.removeTeamMember);

/**
 * @swagger
 * /api/projects/{id}/milestones:
 *   post:
 *     summary: Add milestone to project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 default: pending
 *     responses:
 *       200:
 *         description: Milestone added successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.post('/:id/milestones', authorize('admin', 'manager'), canAccessProject, projectController.addMilestone);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Cannot delete project with dependencies
 *       500:
 *         description: Server error
 */
router.delete('/:id', authorize('admin'), canAccessProject, projectController.deleteProject);

module.exports = router;