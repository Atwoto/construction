const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Employee model for Supabase
 */
class Employee extends BaseModel {
  constructor(data) {
    super(data, 'employees');
  }

  // Instance methods
  async addSkill(skill) {
    const currentSkills = this.skills || [];
    if (!currentSkills.includes(skill)) {
      const skills = [...currentSkills, skill];
      return this.update({ skills });
    }
    return this;
  }

  async removeSkill(skill) {
    const currentSkills = this.skills || [];
    const skills = currentSkills.filter(s => s !== skill);
    return this.update({ skills });
  }

  async addCertification(certification) {
    const currentCertifications = this.certifications || [];
    const certifications = [...currentCertifications, {
      id: Date.now(),
      ...certification,
      obtained_date: certification.obtained_date || new Date().toISOString(),
    }];
    return this.update({ certifications });
  }

  async updateCertification(certId, updates) {
    const currentCertifications = this.certifications || [];
    const certifications = currentCertifications.map(cert => 
      cert.id === certId ? { ...cert, ...updates } : cert
    );
    return this.update({ certifications });
  }

  async addTrainingRecord(training) {
    const currentTrainingRecords = this.training_records || [];
    const trainingRecords = [...currentTrainingRecords, {
      id: Date.now(),
      ...training,
      completed_date: training.completed_date || new Date().toISOString(),
    }];
    return this.update({ training_records: trainingRecords });
  }

  calculateTimeOff() {
    const availableVacation = (this.vacation_days || 0) - (this.used_vacation_days || 0);
    const availableSick = (this.sick_days || 0) - (this.used_sick_days || 0);
    const availablePersonal = (this.personal_days || 0) - (this.used_personal_days || 0);
    
    return {
      vacation: {
        total: this.vacation_days || 0,
        used: this.used_vacation_days || 0,
        available: Math.max(0, availableVacation),
      },
      sick: {
        total: this.sick_days || 0,
        used: this.used_sick_days || 0,
        available: Math.max(0, availableSick),
      },
      personal: {
        total: this.personal_days || 0,
        used: this.used_personal_days || 0,
        available: Math.max(0, availablePersonal),
      },
    };
  }

  async useTimeOff(type, days) {
    const field = `used_${type}_days`;
    const currentUsed = this[field] || 0;
    const totalField = `${type}_days`;
    const total = this[totalField] || 0;
    
    if (currentUsed + days > total) {
      throw new Error(`Insufficient ${type} days available`);
    }
    
    return this.update({ [field]: currentUsed + days });
  }

  async assignToProject(projectId) {
    const currentProjects = this.current_projects || [];
    if (!currentProjects.includes(projectId)) {
      const currentProjects = [...(this.current_projects || []), projectId];
      return this.update({ current_projects: currentProjects });
    }
    return this;
  }

  async removeFromProject(projectId) {
    const currentProjects = this.current_projects || [];
    const updatedProjects = currentProjects.filter(id => id !== projectId);
    return this.update({ current_projects: updatedProjects });
  }

  getYearsOfService() {
    const today = new Date();
    const hireDate = new Date(this.hire_date);
    const years = today.getFullYear() - hireDate.getFullYear();
    const monthDiff = today.getMonth() - hireDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
      return years - 1;
    }
    return years;
  }

  getExpiringCertifications(daysAhead = 30) {
    const currentCertifications = this.certifications || [];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return currentCertifications.filter(cert => {
      if (!cert.expiry_date) return false;
      const expiryDate = new Date(cert.expiry_date);
      return expiryDate <= futureDate;
    });
  }

  async recordSafetyIncident(incident) {
    const currentSafetyRecord = this.safety_record || {};
    const safetyRecord = { ...currentSafetyRecord };
    safetyRecord.incidents = [...(safetyRecord.incidents || []), {
      id: Date.now(),
      ...incident,
      reported_date: incident.reported_date || new Date().toISOString(),
    }];
    
    return this.update({ safety_record: safetyRecord });
  }

  // Class methods
  static async getByDepartment(department, options = {}) {
    return this.findAll({
      where: { department, status: 'active' },
      ...options,
    }, 'employees');
  }

  static async getByStatus(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options,
    }, 'employees');
  }

  static async getActiveEmployees(options = {}) {
    return this.getByStatus('active', options);
  }

  static async getBySupervisor(supervisorId, options = {}) {
    return this.findAll({
      where: { supervisor: supervisorId, status: 'active' },
      ...options,
    }, 'employees');
  }

  static async searchEmployees(searchTerm, options = {}) {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:user_id (
          first_name,
          last_name,
          email
        )
      `)
      .or(`employee_id.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError.internal('Database error', error);
    }

    return data.map(employee => new Employee(employee));
  }

  static async getEmployeeStats() {
    // Get total active employees
    const totalEmployees = await this.count({ 
      where: { status: 'active' } 
    }, 'employees');
    
    // Get employees by department
    const { data: byDepartmentData, error: byDepartmentError } = await supabase
      .from('employees')
      .select('department,count')
      .eq('status', 'active')
      .group('department');
      
    if (byDepartmentError) {
      throw createError.internal('Database error', byDepartmentError);
    }
    
    const byDepartment = byDepartmentData.map(item => ({
      department: item.department,
      count: item.count
    }));
    
    // Get employees by employment type
    const { data: byEmploymentTypeData, error: byEmploymentTypeError } = await supabase
      .from('employees')
      .select('employment_type,count')
      .eq('status', 'active')
      .group('employment_type');
      
    if (byEmploymentTypeError) {
      throw createError.internal('Database error', byEmploymentTypeError);
    }
    
    const byEmploymentType = byEmploymentTypeData.map(item => ({
      type: item.employment_type,
      count: item.count
    }));
    
    return {
      totalEmployees,
      byDepartment,
      byEmploymentType,
    };
  }

  static async getUpcomingReviews(daysAhead = 30, options = {}) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    futureDate.toISOString();
    
    return this.findAll({
      where: {
        next_review_date: { lte: futureDate },
        status: 'active',
      },
      ...options,
    }, 'employees');
  }

  static async getExpiringCertifications(daysAhead = 30, options = {}) {
    // This is a simplified version since Supabase doesn't easily support filtering on JSON fields
    const employees = await this.findAll({
      where: {
        status: 'active',
      },
      ...options,
    }, 'employees');
    
    return employees.filter(emp => {
      return emp.getExpiringCertifications(daysAhead).length > 0;
    });
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'employeeId': 'employee_id',
      'userId': 'user_id',
      'employmentType': 'employment_type',
      'hireDate': 'hire_date',
      'terminationDate': 'termination_date',
      'salary': 'salary',
      'hourlyRate': 'hourly_rate',
      'overtimeRate': 'overtime_rate',
      'payFrequency': 'pay_frequency',
      'emergencyContact': 'emergency_contact',
      'skills': 'skills',
      'certifications': 'certifications',
      'licenses': 'licenses',
      'trainingRecords': 'training_records',
      'performanceRating': 'performance_rating',
      'lastReviewDate': 'last_review_date',
      'nextReviewDate': 'next_review_date',
      'vacationDays': 'vacation_days',
      'sickDays': 'sick_days',
      'personalDays': 'personal_days',
      'usedVacationDays': 'used_vacation_days',
      'usedSickDays': 'used_sick_days',
      'usedPersonalDays': 'used_personal_days',
      'workSchedule': 'work_schedule',
      'equipment': 'equipment',
      'safetyRecord': 'safety_record',
      'notes': 'notes',
      'customFields': 'custom_fields',
      'benefits': 'benefits',
      'bankingInfo': 'banking_info',
      'taxInfo': 'tax_info',
      'availability': 'availability',
      'currentProjects': 'current_projects',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Employee;