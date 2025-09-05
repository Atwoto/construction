import { apiClient } from './authService';
import { Project, ProjectStats } from '../types';

// Request/Response Types
export interface CreateProjectRequest {
  name: string;
  description?: string;
  projectNumber?: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'maintenance';
  status?: 'planning' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  budget: number;
  actualCost?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
  progress?: number;
  clientId: number;
  projectManagerId: number;
  contractorId?: number;
  permits?: object;
  specifications?: object;
  materials?: object;
  notes?: string;
  tags?: string[];
  customFields?: object;
  weatherDependency?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  qualityScore?: number;
  clientSatisfaction?: number;
  teamMembers?: number[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  projectNumber?: string;
  type?: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'maintenance';
  status?: 'planning' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  budget?: number;
  actualCost?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
  progress?: number;
  clientId?: number;
  projectManagerId?: number;
  contractorId?: number;
  permits?: object;
  specifications?: object;
  materials?: object;
  notes?: string;
  tags?: string[];
  customFields?: object;
  weatherDependency?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  qualityScore?: number;
  clientSatisfaction?: number;
  teamMembers?: number[];
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
  clientId?: string;
  projectManagerId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

export interface ProjectMilestone {
  title: string;
  description?: string;
  dueDate: string;
  status?: string;
}

export interface TeamMemberRequest {
  userId: number;
}

export interface StatusUpdateRequest {
  status: 'planning' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
}

export interface ProgressUpdateRequest {
  progress: number;
}

class ProjectService {
  // Get all projects with pagination and filtering
  async getProjects(params: ProjectListParams = {}): Promise<ProjectListResponse> {
    try {
      console.log('🔍 Fetching projects from API with params:', params);
      const response = await apiClient.get('/projects', { params });
      console.log('✅ API response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error fetching projects:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  }

  // Get project by ID
  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  }

  // Create new project
  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data.data.project;
    } catch (error: any) {
      console.error('Error creating project:', error);
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  }

  // Update project
  async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData);
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error updating project with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  }

  // Update project status
  async updateProjectStatus(id: number, status: string): Promise<Project> {
    try {
      const response = await apiClient.patch(`/projects/${id}/status`, { status });
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error updating project status for id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update project status');
    }
  }

  // Update project progress
  async updateProjectProgress(id: number, progress: number): Promise<Project> {
    try {
      const response = await apiClient.patch(`/projects/${id}/progress`, { progress });
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error updating project progress for id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update project progress');
    }
  }

  // Add team member to project
  async addTeamMember(id: number, userId: number): Promise<Project> {
    try {
      const response = await apiClient.post(`/projects/${id}/team-members`, { userId });
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error adding team member to project with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to add team member');
    }
  }

  // Remove team member from project
  async removeTeamMember(id: number, userId: number): Promise<Project> {
    try {
      const response = await apiClient.delete(`/projects/${id}/team-members/${userId}`);
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error removing team member from project with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to remove team member');
    }
  }

  // Add milestone to project
  async addMilestone(id: number, milestone: ProjectMilestone): Promise<Project> {
    try {
      const response = await apiClient.post(`/projects/${id}/milestones`, milestone);
      return response.data.data.project;
    } catch (error: any) {
      console.error(`Error adding milestone to project with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to add milestone');
    }
  }

  // Delete project
  async deleteProject(id: number): Promise<void> {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error: any) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }

  // Get project statistics
  async getProjectStats(startDate?: string, endDate?: string): Promise<ProjectStats> {
    try {
      console.log('📈 Fetching project stats from API');
      
      // Use the optimized endpoint for Vercel
      const response = await apiClient.get('/project-stats');
      console.log('✅ Stats response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error fetching project stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch project statistics');
    }
  }

  // Get projects by status
  async getProjectsByStatus(status: string, limit?: number, offset?: number): Promise<{ projects: Project[] }> {
    try {
      const params: any = { status };
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      
      const response = await apiClient.get(`/projects/status/${status}`, { params });
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching projects with status ${status}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch projects by status');
    }
  }

  // Get overdue projects
  async getOverdueProjects(limit?: number, offset?: number): Promise<{ projects: Project[] }> {
    try {
      const params: any = {};
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      
      const response = await apiClient.get('/projects/overdue', { params });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching overdue projects:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch overdue projects');
    }
  }

  // Utility methods for display and formatting
  getProjectStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      planning: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      on_hold: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  getProjectPriorityColor(priority: string): string {
    const priorityColors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  }

  getProjectTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      residential: '🏠',
      commercial: '🏢',
      industrial: '🏭',
      infrastructure: '🌉',
      renovation: '🔨',
      maintenance: '🔧'
    };
    return typeIcons[type] || '🏗️';
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }

  formatProjectNumber(projectNumber: string): string {
    // Format project number for display
    return projectNumber.toUpperCase();
  }

  getProjectAddress(project: Project): string {
    return `${project.address}, ${project.city}, ${project.state} ${project.zipCode}`;
  }

  calculateProjectHealth(project: Project): 'excellent' | 'good' | 'warning' | 'critical' {
    const today = new Date();
    const endDate = new Date(project.estimatedEndDate);
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate health based on progress vs time remaining
    const timeProgress = project.progress || 0;
    const totalDuration = Math.max(1, Math.ceil((new Date(project.estimatedEndDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const expectedProgress = Math.max(0, 100 - (daysRemaining / totalDuration) * 100);
    
    const healthScore = timeProgress - expectedProgress;
    
    if (healthScore >= 10) return 'excellent';
    if (healthScore >= 0) return 'good';
    if (healthScore >= -10) return 'warning';
    return 'critical';
  }

  getProjectHealthColor(health: string): string {
    const healthColors: { [key: string]: string } = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600'
    };
    return healthColors[health] || 'text-gray-600';
  }

  calculateProjectDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  isProjectOverdue(project: Project): boolean {
    const today = new Date();
    const endDate = new Date(project.estimatedEndDate);
    return endDate < today && project.status !== 'completed';
  }

  getProjectDaysRemaining(project: Project): number {
    const today = new Date();
    const endDate = new Date(project.estimatedEndDate);
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  validateProjectDates(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  }

  validateProjectData(data: CreateProjectRequest | UpdateProjectRequest): string[] {
    const errors: string[] = [];

    if ('name' in data && !data.name?.trim()) {
      errors.push('Project name is required');
    }

    if ('startDate' in data && 'estimatedEndDate' in data && data.startDate && data.estimatedEndDate) {
      if (!this.validateProjectDates(data.startDate, data.estimatedEndDate)) {
        errors.push('Start date must be before estimated end date');
      }
    }

    if ('budget' in data && data.budget !== undefined && data.budget <= 0) {
      errors.push('Budget must be greater than 0');
    }

    if ('progress' in data && data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
      errors.push('Progress must be between 0 and 100');
    }

    if ('clientId' in data && data.clientId !== undefined && data.clientId <= 0) {
      errors.push('Valid client must be selected');
    }

    if ('projectManagerId' in data && data.projectManagerId !== undefined && data.projectManagerId <= 0) {
      errors.push('Valid project manager must be selected');
    }

    return errors;
  }
}

// Create and export service instance
export const projectService = new ProjectService();
export default projectService;