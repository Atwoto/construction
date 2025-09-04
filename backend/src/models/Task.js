const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Task model for Supabase
 */
class Task extends BaseModel {
  constructor(data) {
    super(data, 'tasks');
  }

  // Instance methods
  async updateProgress(percentage) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    
    const updates = { progress: percentage };
    
    if (percentage === 100 && this.status !== 'completed') {
      updates.status = 'completed';
      updates.completed_at = new Date().toISOString();
    }
    
    return this.update(updates);
  }

  async updateStatus(newStatus) {
    const updates = { status: newStatus };
    
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      if (this.progress < 100) {
        updates.progress = 100;
      }
    }
    
    return this.update(updates);
  }

  isOverdue() {
    return new Date(this.due_date) < new Date() && this.status !== 'completed';
  }

  getDaysRemaining() {
    const today = new Date();
    const dueDate = new Date(this.due_date);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Class methods
  static async getByStatus(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options,
    }, 'tasks');
  }

  static async getOverdueTasks(options = {}) {
    const now = new Date().toISOString();
    return this.findAll({
      where: {
        due_date: { lt: now },
        status: { notIn: ['completed'] },
      },
      ...options,
    }, 'tasks');
  }

  static async getTasksByProject(projectId, options = {}) {
    return this.findAll({
      where: { project_id: projectId },
      ...options,
    }, 'tasks');
  }

  static async getTasksByAssignee(assigneeId, options = {}) {
    return this.findAll({
      where: { assigned_to: assigneeId },
      ...options,
    }, 'tasks');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'projectId': 'project_id',
      'assignedTo': 'assigned_to',
      'estimatedHours': 'estimated_hours',
      'actualHours': 'actual_hours',
      'startDate': 'start_date',
      'dueDate': 'due_date',
      'completedAt': 'completed_at',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Task;