const Project = require('../models/Project');
const Client = require('../models/Client');
const User = require('../models/User');
const { supabaseAdmin } = require('../config/supabase');
const { createError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Utility function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

/**
 * Project Management Controller
 * Handles CRUD operations for project management
 */
class ProjectController {
  // Get all projects with pagination and filtering
  getAllProjects = asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        priority,
        clientId,
        projectManagerId,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc',
        startDate,
        endDate
      } = req.query;

      const offset = (page - 1) * limit;
      let query = supabaseAdmin
        .from('projects')
        .select(`
          *,
          client:clients(id, company_name, contact_person, email, phone),
          project_manager:users!project_manager_id(id, first_name, last_name, email)
        `, { count: 'exact' })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('type', type);
      if (priority) query = query.eq('priority', priority);
      if (clientId) query = query.eq('client_id', clientId);
      if (projectManagerId) query = query.eq('project_manager_id', projectManagerId);

      // Date range filter
      if (startDate) query = query.gte('start_date', new Date(startDate).toISOString());
      if (endDate) query = query.lte('start_date', new Date(endDate).toISOString());

      // Search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,project_number.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
      }

      // Apply sorting
      const orderField = ['name', 'project_number', 'status', 'type', 'priority', 'start_date', 'estimated_end_date', 'created_at'].includes(sortBy) ? sortBy : 'created_at';
      const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';
      query = query.order(orderField, { ascending: orderDirection === 'asc' });

      const { data: projects, count, error } = await query;

      if (error) {
        throw createError.internal('Failed to fetch projects', error);
      }

      const totalPages = Math.ceil(count / limit);
      const currentPage = parseInt(page);

      res.json({
        success: true,
        data: {
          projects: toCamelCase(projects),
          pagination: {
            currentPage,
            totalPages,
            totalProjects: count,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get projects error:', error);
      throw error;
    }
  });

  // Get project by ID
  getProjectById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .select(`
          *,
          client:clients(id, company_name, contact_person, email, phone, address),
          project_manager:users!project_manager_id(id, first_name, last_name, email, role),
          tasks:tasks(
            *,
            order(created_at.desc)
          ),
          documents:documents(
            *,
            order(created_at.desc)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw createError.notFound('Project not found');
        }
        throw createError.internal('Failed to fetch project', error);
      }

      // Return project with camelCase conversion
      const projectData = toCamelCase(project);

      res.json({
        success: true,
        data: { project: projectData }
      });
    } catch (error) {
      logger.error('Get project error:', error);
      throw error;
    }
  });

  // Create new project
  createProject = asyncHandler(async (req, res) => {
    try {
      const {
        name,
        description,
        type,
        status = 'planning',
        priority = 'medium',
        startDate,
        estimatedEndDate,
        address,
        city,
        state,
        zipCode,
        budget,
        estimatedRevenue,
        clientId,
        projectManagerId,
        contractorId,
        permits = {},
        specifications = {},
        materials = {},
        notes,
        tags = [],
        customFields = {},
        weatherDependency = false,
        riskLevel = 'low',
        teamMembers = []
      } = req.body;

      // Validation
      if (!name || !type || !startDate || !estimatedEndDate || !address || !city || !state || !zipCode || !budget || !clientId || !projectManagerId) {
        throw createError.badRequest('Missing required fields', {
          required: ['name', 'type', 'startDate', 'estimatedEndDate', 'address', 'city', 'state', 'zipCode', 'budget', 'clientId', 'projectManagerId']
        });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(estimatedEndDate);
      if (start >= end) {
        throw createError.badRequest('Start date must be before estimated end date');
      }

      // Validate client exists
      const { data: client, error: clientError } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('id', clientId)
        .single();

      if (clientError || !client) {
        throw createError.notFound('Client not found');
      }

      // Validate project manager exists
      const { data: projectManager, error: pmError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', projectManagerId)
        .single();

      if (pmError || !projectManager) {
        throw createError.notFound('Project manager not found');
      }

      // Create project
      const projectData = {
        name,
        description,
        type,
        status,
        priority,
        start_date: startDate,
        estimated_end_date: estimatedEndDate,
        address,
        city,
        state,
        zip_code: zipCode,
        budget: parseFloat(budget),
        estimated_revenue: estimatedRevenue ? parseFloat(estimatedRevenue) : null,
        client_id: parseInt(clientId),
        project_manager_id: parseInt(projectManagerId),
        contractor_id: contractorId ? parseInt(contractorId) : null,
        permits,
        specifications,
        materials,
        notes,
        tags,
        custom_fields: customFields,
        weather_dependency: weatherDependency,
        risk_level: riskLevel,
        team_members: teamMembers.map(id => parseInt(id))
      };

      const { data: project, error: createError } = await supabaseAdmin
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (createError) {
        throw createError.internal('Error creating project', createError);
      }

      // Fetch the created project with associations
      const { data: createdProject, error: fetchError } = await supabaseAdmin
        .from('projects')
        .select(`
          *,
          client:clients(id, company_name, contact_person, email),
          project_manager:users!project_manager_id(id, first_name, last_name, email)
        `)
        .eq('id', project.id)
        .single();

      if (fetchError) {
        throw createError.internal('Failed to fetch created project', fetchError);
      }

      res.status(201).json({
        success: true,
        data: { project: toCamelCase(createdProject) },
        message: 'Project created successfully'
      });
    } catch (error) {
      logger.error('Create project error:', error);
      throw error;
    }
  });

  // Update project
  updateProject = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Check if project exists
      const { data: existingProject, error: checkError } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError || !existingProject) {
        throw createError.notFound('Project not found');
      }

      // Validate dates if provided
      if (updateData.startDate && updateData.estimatedEndDate) {
        const start = new Date(updateData.startDate);
        const end = new Date(updateData.estimatedEndDate);
        if (start >= end) {
          throw createError.badRequest('Start date must be before estimated end date');
        }
      }

      // Validate client if provided
      if (updateData.clientId) {
        const { data: client, error: clientError } = await supabaseAdmin
          .from('clients')
          .select('id')
          .eq('id', updateData.clientId)
          .single();

        if (clientError || !client) {
          throw createError.notFound('Client not found');
        }
      }

      // Validate project manager if provided
      if (updateData.projectManagerId) {
        const { data: projectManager, error: pmError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('id', updateData.projectManagerId)
          .single();

        if (pmError || !projectManager) {
          throw createError.notFound('Project manager not found');
        }
      }

      // Convert fields to appropriate database format
      const dbUpdateData = {
        updated_at: new Date().toISOString(),
      };

      // Map camelCase to snake_case and convert types
      if (updateData.name !== undefined) dbUpdateData.name = updateData.name;
      if (updateData.description !== undefined) dbUpdateData.description = updateData.description;
      if (updateData.projectNumber !== undefined) dbUpdateData.project_number = updateData.projectNumber;
      if (updateData.type !== undefined) dbUpdateData.type = updateData.type;
      if (updateData.status !== undefined) dbUpdateData.status = updateData.status;
      if (updateData.priority !== undefined) dbUpdateData.priority = updateData.priority;
      if (updateData.startDate !== undefined) dbUpdateData.start_date = updateData.startDate;
      if (updateData.estimatedEndDate !== undefined) dbUpdateData.estimated_end_date = updateData.estimatedEndDate;
      if (updateData.actualEndDate !== undefined) dbUpdateData.actual_end_date = updateData.actualEndDate;
      if (updateData.address !== undefined) dbUpdateData.address = updateData.address;
      if (updateData.city !== undefined) dbUpdateData.city = updateData.city;
      if (updateData.state !== undefined) dbUpdateData.state = updateData.state;
      if (updateData.zipCode !== undefined) dbUpdateData.zip_code = updateData.zipCode;
      if (updateData.budget !== undefined) dbUpdateData.budget = parseFloat(updateData.budget);
      if (updateData.actualCost !== undefined) dbUpdateData.actual_cost = parseFloat(updateData.actualCost);
      if (updateData.estimatedRevenue !== undefined) dbUpdateData.estimated_revenue = parseFloat(updateData.estimatedRevenue);
      if (updateData.actualRevenue !== undefined) dbUpdateData.actual_revenue = parseFloat(updateData.actualRevenue);
      if (updateData.progress !== undefined) dbUpdateData.progress = parseInt(updateData.progress);
      if (updateData.clientId !== undefined) dbUpdateData.client_id = parseInt(updateData.clientId);
      if (updateData.projectManagerId !== undefined) dbUpdateData.project_manager_id = parseInt(updateData.projectManagerId);
      if (updateData.contractorId !== undefined) dbUpdateData.contractor_id = parseInt(updateData.contractorId);
      if (updateData.permits !== undefined) dbUpdateData.permits = updateData.permits;
      if (updateData.specifications !== undefined) dbUpdateData.specifications = updateData.specifications;
      if (updateData.materials !== undefined) dbUpdateData.materials = updateData.materials;
      if (updateData.notes !== undefined) dbUpdateData.notes = updateData.notes;
      if (updateData.tags !== undefined) dbUpdateData.tags = updateData.tags;
      if (updateData.customFields !== undefined) dbUpdateData.custom_fields = updateData.customFields;
      if (updateData.weatherDependency !== undefined) dbUpdateData.weather_dependency = updateData.weatherDependency;
      if (updateData.riskLevel !== undefined) dbUpdateData.risk_level = updateData.riskLevel;
      if (updateData.qualityScore !== undefined) dbUpdateData.quality_score = updateData.qualityScore;
      if (updateData.clientSatisfaction !== undefined) dbUpdateData.client_satisfaction = updateData.clientSatisfaction;
      if (updateData.teamMembers !== undefined) dbUpdateData.team_members = updateData.teamMembers.map(id => parseInt(id));

      // Update project
      const { data: updatedProject, error: updateError } = await supabaseAdmin
        .from('projects')
        .update(dbUpdateData)
        .eq('id', id)
        .select(`
          *,
          client:clients(id, company_name, contact_person, email),
          project_manager:users!project_manager_id(id, first_name, last_name, email)
        `)
        .single();

      if (updateError) {
        throw createError.internal('Error updating project', updateError);
      }

      res.json({
        success: true,
        data: { project: toCamelCase(updatedProject) },
        message: 'Project updated successfully'
      });
    } catch (error) {
      logger.error('Update project error:', error);
      throw error;
    }
  });

  // Update project status
  updateProjectStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw createError.badRequest('Status is required');
      }

      // Check if project exists and update status
      const { data: project, error: updateError } = await supabaseAdmin
        .from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === 'PGRST116') {
          throw createError.notFound('Project not found');
        }
        throw createError.internal('Error updating project status', updateError);
      }

      res.json({
        success: true,
        data: { project: toCamelCase(project) },
        message: 'Project status updated successfully'
      });
    } catch (error) {
      logger.error('Update project status error:', error);
      throw error;
    }
  });

  // Update project progress
  updateProjectProgress = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;

      if (progress === undefined || progress < 0 || progress > 100) {
        throw createError.badRequest('Progress must be between 0 and 100');
      }

      // Check if project exists and update progress
      const { data: project, error: updateError } = await supabaseAdmin
        .from('projects')
        .update({ progress: parseInt(progress), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === 'PGRST116') {
          throw createError.notFound('Project not found');
        }
        throw createError.internal('Error updating project progress', updateError);
      }

      res.json({
        success: true,
        data: { project: toCamelCase(project) },
        message: 'Project progress updated successfully'
      });
    } catch (error) {
      logger.error('Update project progress error:', error);
      throw error;
    }
  });

  // Add team member to project
  addTeamMember = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        throw createError.badRequest('User ID is required');
      }

      // Check if project exists
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('team_members')
        .eq('id', id)
        .single();

      if (projectError) {
        if (projectError.code === 'PGRST116') {
          throw createError.notFound('Project not found');
        }
        throw createError.internal('Error fetching project', projectError);
      }

      // Validate user exists
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        throw createError.notFound('User not found');
      }

      // Add user to team members array
      const currentTeamMembers = project.team_members || [];
      const updatedTeamMembers = [...currentTeamMembers, parseInt(userId)];

      // Update project with new team members
      const { data: updatedProject, error: updateError } = await supabaseAdmin
        .from('projects')
        .update({ team_members: updatedTeamMembers, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw createError.internal('Error adding team member', updateError);
      }

      res.json({
        success: true,
        data: { project: toCamelCase(updatedProject) },
        message: 'Team member added successfully'
      });
    } catch (error) {
      logger.error('Add team member error:', error);
      throw error;
    }
  });

  // Remove team member from project
  removeTeamMember = asyncHandler(async (req, res) => {
    try {
      const { id, userId } = req.params;

      // Check if project exists
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('team_members')
        .eq('id', id)
        .single();

      if (projectError) {
        if (projectError.code === 'PGRST116') {
          throw createError.notFound('Project not found');
        }
        throw createError.internal('Error fetching project', projectError);
      }

      // Remove user from team members array
      const currentTeamMembers = project.team_members || [];
      const updatedTeamMembers = currentTeamMembers.filter(memberId => memberId !== parseInt(userId));

      // Update project with new team members
      const { data: updatedProject, error: updateError } = await supabaseAdmin
        .from('projects')
        .update({ team_members: updatedTeamMembers, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw createError.internal('Error removing team member', updateError);
      }

      res.json({
        success: true,
        data: { project: toCamelCase(updatedProject) },
        message: 'Team member removed successfully'
      });
    } catch (error) {
      logger.error('Remove team member error:', error);
      throw error;
    }
  });

  // Add milestone to project
  addMilestone = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, dueDate, status = 'pending' } = req.body;

      if (!title || !dueDate) {
        throw createError.badRequest('Title and due date are required');
      }

      // Check if project exists
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('milestones')
        .eq('id', id)
        .single();

      if (projectError) {
        if (projectError.code === 'PGRST116') {
          throw createError.notFound('Project not found');
        }
        throw createError.internal('Error fetching project', projectError);
      }

      const milestone = {
        title,
        description,
        due_date: dueDate,
        status
      };

      // Add milestone to existing milestones array
      const currentMilestones = project.milestones || [];
      const updatedMilestones = [...currentMilestones, milestone];

      // Update project with new milestones
      const { data: updatedProject, error: updateError } = await supabaseAdmin
        .from('projects')
        .update({ milestones: updatedMilestones, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw createError.internal('Error adding milestone', updateError);
      }

      res.json({
        success: true,
        data: { project: toCamelCase(updatedProject) },
        message: 'Milestone added successfully'
      });
    } catch (error) {
      logger.error('Add milestone error:', error);
      throw error;
    }
  });

  // Delete project
  deleteProject = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      // Check if project exists
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('id', id)
        .single();

      if (projectError || !project) {
        throw createError.notFound('Project not found');
      }

      // Check if project has dependent records (tasks, invoices, etc.)
      const { count: taskCount, error: taskError } = await supabaseAdmin
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

      if (taskError) {
        throw createError.internal('Error checking project tasks', taskError);
      }

      const { count: invoiceCount, error: invoiceError } = await supabaseAdmin
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

      if (invoiceError) {
        throw createError.internal('Error checking project invoices', invoiceError);
      }

      if (taskCount > 0 || invoiceCount > 0) {
        throw createError.badRequest('Cannot delete project with existing tasks or invoices', {
          details: {
            tasks: taskCount,
            invoices: invoiceCount
          }
        });
      }

      // Delete the project
      const { error: deleteError } = await supabaseAdmin
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw createError.internal('Error deleting project', deleteError);
      }

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      logger.error('Delete project error:', error);
      throw error;
    }
  });

  // Get project statistics
  getProjectStats = asyncHandler(async (req, res) => {
    try {
      const startTime = Date.now();
      logger.info('Starting project statistics calculation');
      
      // Try to use the RPC function for better performance
      const { data: stats, error } = await supabaseAdmin
        .rpc('get_project_statistics');

      if (error) {
        logger.error('Project statistics RPC error:', error);
        logger.warn('Project statistics RPC not available, using fallback method');
        
        // Get total projects count
        const { count: totalProjects, error: totalError } = await supabaseAdmin
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (totalError) {
          throw createError.internal('Error counting total projects', totalError);
        }

        // Get active projects count
        const { count: activeProjects, error: activeError } = await supabaseAdmin
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in_progress');

        if (activeError) {
          throw createError.internal('Error counting active projects', activeError);
        }

        // Get completed projects count
        const { count: completedProjects, error: completedError } = await supabaseAdmin
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        if (completedError) {
          throw createError.internal('Error counting completed projects', completedError);
        }

        // Get on-hold projects count
        const { count: onHoldProjects, error: onHoldError } = await supabaseAdmin
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'on_hold');

        if (onHoldError) {
          throw createError.internal('Error counting on-hold projects', onHoldError);
        }

        // Get average progress
        const { data: avgProgressData, error: avgProgressError } = await supabaseAdmin
          .from('projects')
          .select('progress')
          .not('progress', 'is', null);

        if (avgProgressError) {
          throw createError.internal('Error fetching project progress data', avgProgressError);
        }

        const averageProgress = avgProgressData.length > 0 
          ? avgProgressData.reduce((sum, project) => sum + (project.progress || 0), 0) / avgProgressData.length 
          : 0;

        // Get total budget
        const { data: budgetData, error: budgetError } = await supabaseAdmin
          .from('projects')
          .select('budget');

        if (budgetError) {
          throw createError.internal('Error fetching project budget data', budgetError);
        }

        const totalBudget = budgetData.reduce((sum, project) => sum + (project.budget || 0), 0);

        // Get total actual cost
        const { data: actualCostData, error: actualCostError } = await supabaseAdmin
          .from('projects')
          .select('actual_cost');

        if (actualCostError) {
          throw createError.internal('Error fetching project actual cost data', actualCostError);
        }

        const totalActualCost = actualCostData.reduce((sum, project) => sum + (project.actual_cost || 0), 0);

        // Get total revenue
        const { data: revenueData, error: revenueError } = await supabaseAdmin
          .from('projects')
          .select('actual_revenue');

        if (revenueError) {
          throw createError.internal('Error fetching project revenue data', revenueError);
        }

        const totalRevenue = revenueData.reduce((sum, project) => sum + (project.actual_revenue || 0), 0);

        const endTime = Date.now();
        logger.info(`Project statistics calculation completed in ${endTime - startTime}ms using fallback method`);
        
        res.json({
          success: true,
          data: {
            totalProjects,
            activeProjects,
            completedProjects,
            onHoldProjects,
            averageProgress: Math.round(averageProgress * 100) / 100,
            totalBudget,
            totalActualCost,
            totalRevenue
          }
        });
      } else {
        // Use the RPC function result
        const stat = stats[0] || {
          total_projects: 0,
          active_projects: 0,
          completed_projects: 0,
          on_hold_projects: 0,
          average_progress: 0,
          total_budget: 0,
          total_actual_cost: 0,
          total_revenue: 0
        };

        const endTime = Date.now();
        logger.info(`Project statistics calculation completed in ${endTime - startTime}ms using RPC function`);
        
        res.json({
          success: true,
          data: {
            totalProjects: stat.total_projects,
            activeProjects: stat.active_projects,
            completedProjects: stat.completed_projects,
            onHoldProjects: stat.on_hold_projects,
            averageProgress: stat.average_progress,
            totalBudget: stat.total_budget,
            totalActualCost: stat.total_actual_cost,
            totalRevenue: stat.total_revenue
          }
        });
      }
    } catch (error) {
      logger.error('Get project stats error:', error);
      throw error;
    }
  });

  // Get projects by status
  getProjectsByStatus = asyncHandler(async (req, res) => {
    try {
      const { status } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      const { data: projects, error } = await supabaseAdmin
        .from('projects')
        .select(`
          *,
          client:clients(id, company_name, contact_person),
          project_manager:users!project_manager_id(id, first_name, last_name)
        `)
        .eq('status', status)
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw createError.internal('Error fetching projects by status', error);
      }

      res.json({
        success: true,
        data: { projects: toCamelCase(projects) || [] }
      });
    } catch (error) {
      logger.error('Get projects by status error:', error);
      throw error;
    }
  });

  // Get overdue projects
  getOverdueProjects = asyncHandler(async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const currentDate = new Date().toISOString().split('T')[0];

      const { data: projects, error } = await supabaseAdmin
        .from('projects')
        .select(`
          *,
          client:clients(id, company_name, contact_person),
          project_manager:users!project_manager_id(id, first_name, last_name)
        `)
        .lt('estimated_end_date', currentDate)
        .neq('status', 'completed')
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
        .order('estimated_end_date', { ascending: true });

      if (error) {
        throw createError.internal('Error fetching overdue projects', error);
      }

      res.json({
        success: true,
        data: { projects: toCamelCase(projects) || [] }
      });
    } catch (error) {
      logger.error('Get overdue projects error:', error);
      throw error;
    }
  });
}

module.exports = new ProjectController();