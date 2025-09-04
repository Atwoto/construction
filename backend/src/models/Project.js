const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Project model for Supabase
 */
class Project extends BaseModel {
  constructor(data) {
    super(data, 'projects');
  }

  // Instance methods
  getFullAddress() {
    return `${this.address}, ${this.city}, ${this.state} ${this.zip_code}`;
  }

  async updateProgress(percentage) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    
    const updates = { progress: percentage };
    
    if (percentage === 100 && this.status !== 'completed') {
      updates.status = 'completed';
      updates.completed_at = new Date().toISOString();
      updates.actual_end_date = new Date().toISOString();
    }
    
    return this.update(updates);
  }

  async updateStatus(newStatus) {
    const updates = { status: newStatus };
    
    switch (newStatus) {
      case 'approved':
        updates.approved_at = new Date().toISOString();
        break;
      case 'in_progress':
        if (!this.started_at) {
          updates.started_at = new Date().toISOString();
        }
        break;
      case 'completed':
        updates.completed_at = new Date().toISOString();
        updates.actual_end_date = new Date().toISOString();
        if (this.progress < 100) {
          updates.progress = 100;
        }
        break;
    }
    
    return this.update(updates);
  }

  async addMilestone(milestone) {
    const currentMilestones = this.milestones || [];
    const milestones = [...currentMilestones, {
      id: Date.now(),
      ...milestone,
      created_at: new Date().toISOString(),
    }];
    return this.update({ milestones });
  }

  async updateMilestone(milestoneId, updates) {
    const currentMilestones = this.milestones || [];
    const milestones = currentMilestones.map(m => 
      m.id === milestoneId ? { ...m, ...updates, updated_at: new Date().toISOString() } : m
    );
    return this.update({ milestones });
  }

  async addTeamMember(userId) {
    const currentTeamMembers = this.team_members || [];
    if (!currentTeamMembers.includes(userId)) {
      const teamMembers = [...currentTeamMembers, userId];
      return this.update({ team_members: teamMembers });
    }
    return this;
  }

  async removeTeamMember(userId) {
    const currentTeamMembers = this.team_members || [];
    const teamMembers = currentTeamMembers.filter(id => id !== userId);
    return this.update({ team_members: teamMembers });
  }

  calculateProfitability() {
    const actualRevenue = parseFloat(this.actual_revenue || 0);
    const actualCost = parseFloat(this.actual_cost || 0);
    const budget = parseFloat(this.budget || 0);
    
    const profit = actualRevenue - actualCost;
    const margin = actualRevenue > 0 ? (profit / actualRevenue) * 100 : 0;
    
    return {
      profit,
      margin,
      budgetVariance: budget - actualCost,
      budgetVariancePercent: budget > 0 ? ((budget - actualCost) / budget) * 100 : 0,
    };
  }

  isOverdue() {
    return new Date(this.estimated_end_date) < new Date() && this.status !== 'completed';
  }

  getDaysRemaining() {
    const today = new Date();
    const endDate = new Date(this.estimated_end_date);
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDuration() {
    const start = new Date(this.start_date);
    const end = this.actual_end_date ? new Date(this.actual_end_date) : new Date(this.estimated_end_date);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Class methods
  static async getByStatus(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options,
    }, 'projects');
  }

  static async getActiveProjects(options = {}) {
    return this.findAll({
      where: {
        status: { in: ['approved', 'in_progress'] },
      },
      ...options,
    }, 'projects');
  }

  static async getOverdueProjects(options = {}) {
    const now = new Date().toISOString();
    return this.findAll({
      where: {
        estimated_end_date: { lt: now },
        status: { notIn: ['completed', 'cancelled'] },
      },
      ...options,
    }, 'projects');
  }

  static async getProjectsByManager(managerId, options = {}) {
    return this.findAll({
      where: { project_manager_id: managerId },
      ...options,
    }, 'projects');
  }

  static async getProjectsByClient(clientId, options = {}) {
    return this.findAll({
      where: { client_id: clientId },
      ...options,
    }, 'projects');
  }

  static async searchProjects(searchTerm, options = {}) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,project_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError.internal('Database error', error);
    }

    return data.map(project => new Project(project));
  }

  static async getProjectStats(startDate, endDate) {
    console.log('getProjectStats called with:', { startDate, endDate });
    
    try {
      const totalProjects = await this.count({
        where: {
          created_at: { gte: startDate, lte: endDate },
        },
      }, 'projects');
      console.log('totalProjects count:', totalProjects);
      
      const completedProjects = await this.count({
        where: {
          completed_at: { gte: startDate, lte: endDate },
          status: 'completed',
        },
      }, 'projects');
      console.log('completedProjects count:', completedProjects);
      
      const activeProjects = await this.count({
        where: {
          status: { in: ['approved', 'in_progress'] },
        },
      }, 'projects');
      console.log('activeProjects count:', activeProjects);
      
      const now = new Date().toISOString();
      const overdueProjects = await this.count({
        where: {
          estimated_end_date: { lt: now },
          status: { notIn: ['completed', 'cancelled'] },
        },
      }, 'projects');
      console.log('overdueProjects count:', overdueProjects);
      
      return {
        totalProjects,
        completedProjects,
        activeProjects,
        overdueProjects,
        completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
      };
    } catch (error) {
      console.error('Error in getProjectStats:', error);
      throw error;
    }
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'projectNumber': 'project_number',
      'startDate': 'start_date',
      'estimatedEndDate': 'estimated_end_date',
      'actualEndDate': 'actual_end_date',
      'zipCode': 'zip_code',
      'actualCost': 'actual_cost',
      'estimatedRevenue': 'estimated_revenue',
      'actualRevenue': 'actual_revenue',
      'clientId': 'client_id',
      'projectManagerId': 'project_manager_id',
      'contractorId': 'contractor_id',
      'weatherDependency': 'weather_dependency',
      'riskLevel': 'risk_level',
      'qualityScore': 'quality_score',
      'clientSatisfaction': 'client_satisfaction',
      'teamMembers': 'team_members',
      'approvedAt': 'approved_at',
      'startedAt': 'started_at',
      'completedAt': 'completed_at',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Project;