import { supabase } from './supabaseClient';
import { Project, ProjectStats } from '../types';

// Helper function to convert Supabase project data to our Project type
const formatProject = (project: any): Project => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    projectNumber: project.project_number,
    type: project.type,
    status: project.status,
    priority: project.priority,
    startDate: project.start_date,
    estimatedEndDate: project.estimated_end_date,
    actualEndDate: project.actual_end_date,
    address: project.address,
    city: project.city,
    state: project.state,
    zipCode: project.zip_code,
    budget: project.budget,
    actualCost: project.actual_cost,
    estimatedRevenue: project.estimated_revenue,
    actualRevenue: project.actual_revenue,
    progress: project.progress,
    clientId: project.client_id,
    projectManagerId: project.project_manager_id,
    contractorId: project.contractor_id,
    notes: project.notes,
    tags: project.tags || [],
    teamMembers: project.team_members || [],
    weatherDependency: project.weather_dependency,
    riskLevel: project.risk_level,
    qualityScore: project.quality_score,
    clientSatisfaction: project.client_satisfaction,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
};

export const supabaseProjectService = {
  // Get all projects with pagination and filtering
  async getProjects(params: any = {}): Promise<{ projects: Project[], pagination: any }> {
    let query = supabase.from('projects').select('*', { count: 'exact' });

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status);
    }
    if (params.type) {
      query = query.eq('type', params.type);
    }
    if (params.priority) {
      query = query.eq('priority', params.priority);
    }
    if (params.clientId) {
      query = query.eq('client_id', params.clientId);
    }
    if (params.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    // Apply sorting
    if (params.sortBy) {
      query = query.order(params.sortBy, { ascending: params.sortOrder === 'ASC' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    const totalProjects = count || 0;
    const totalPages = Math.ceil(totalProjects / limit);

    return {
      projects: data?.map(formatProject) || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalProjects,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit,
      }
    };
  },

  // Get project by ID
  async getProjectById(id: number): Promise<Project | null> {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

    if (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }

    return data ? formatProject(data) : null;
  },

  // Get project statistics
  async getProjectStats(): Promise<ProjectStats> {
    const { data, error } = await supabase
      .from('projects')
      .select('status, budget, actual_cost, actual_revenue, progress');

    if (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }

    // Calculate statistics
    const totalProjects = data.length;
    const activeProjects = data.filter((p: any) => p.status === 'in_progress').length;
    const completedProjects = data.filter((p: any) => p.status === 'completed').length;
    const onHoldProjects = data.filter((p: any) => p.status === 'on_hold').length;
    
    // Calculate average progress
    const totalProgress = data.reduce((sum: number, project: any) => sum + (project.progress || 0), 0);
    const averageProgress = totalProjects > 0 ? totalProgress / totalProjects : 0;
    
    // Calculate financials
    const totalBudget = data.reduce((sum: number, project: any) => sum + (project.budget || 0), 0);
    const totalActualCost = data.reduce((sum: number, project: any) => sum + (project.actual_cost || 0), 0);
    const totalRevenue = data.reduce((sum: number, project: any) => sum + (project.actual_revenue || 0), 0);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      averageProgress,
      totalBudget,
      totalActualCost,
      totalRevenue
    };
  },

  // Create new project
  async createProject(projectData: any): Promise<Project> {
    // Convert camelCase to snake_case for Supabase
    const supabaseData = {
      name: projectData.name,
      description: projectData.description,
      project_number: projectData.projectNumber,
      type: projectData.type,
      status: projectData.status,
      priority: projectData.priority,
      start_date: projectData.startDate,
      estimated_end_date: projectData.estimatedEndDate,
      actual_end_date: projectData.actualEndDate,
      address: projectData.address,
      city: projectData.city,
      state: projectData.state,
      zip_code: projectData.zipCode,
      budget: projectData.budget,
      actual_cost: projectData.actualCost,
      estimated_revenue: projectData.estimatedRevenue,
      actual_revenue: projectData.actualRevenue,
      progress: projectData.progress,
      client_id: projectData.clientId,
      project_manager_id: projectData.projectManagerId,
      contractor_id: projectData.contractorId,
      notes: projectData.notes,
      tags: projectData.tags,
      team_members: projectData.teamMembers,
      weather_dependency: projectData.weatherDependency,
      risk_level: projectData.riskLevel,
      quality_score: projectData.qualityScore,
      client_satisfaction: projectData.clientSatisfaction,
    };

    const { data, error } = await supabase.from('projects').insert([supabaseData]).select();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return formatProject(data[0]);
  },

  // Update project
  async updateProject(id: number, projectData: any): Promise<Project> {
    // Convert camelCase to snake_case for Supabase
    const supabaseData = {
      name: projectData.name,
      description: projectData.description,
      project_number: projectData.projectNumber,
      type: projectData.type,
      status: projectData.status,
      priority: projectData.priority,
      start_date: projectData.startDate,
      estimated_end_date: projectData.estimatedEndDate,
      actual_end_date: projectData.actualEndDate,
      address: projectData.address,
      city: projectData.city,
      state: projectData.state,
      zip_code: projectData.zipCode,
      budget: projectData.budget,
      actual_cost: projectData.actualCost,
      estimated_revenue: projectData.estimatedRevenue,
      actual_revenue: projectData.actualRevenue,
      progress: projectData.progress,
      client_id: projectData.clientId,
      project_manager_id: projectData.projectManagerId,
      contractor_id: projectData.contractorId,
      notes: projectData.notes,
      tags: projectData.tags,
      team_members: projectData.teamMembers,
      weather_dependency: projectData.weatherDependency,
      risk_level: projectData.riskLevel,
      quality_score: projectData.qualityScore,
      client_satisfaction: projectData.clientSatisfaction,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('projects').update(supabaseData).eq('id', id).select();

    if (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }

    return formatProject(data[0]);
  },

  // Delete project
  async deleteProject(id: number): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },

  // Update project status
  async updateProjectStatus(id: number, status: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating project status for id ${id}:`, error);
      throw error;
    }

    return formatProject(data[0]);
  },

  // Update project progress
  async updateProjectProgress(id: number, progress: number): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating project progress for id ${id}:`, error);
      throw error;
    }

    return formatProject(data[0]);
  },
};