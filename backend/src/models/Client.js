const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Client model for Supabase
 */
class Client extends BaseModel {
  constructor(data) {
    super(data, 'clients');
  }

  // Instance methods
  getFullAddress() {
    return `${this.address}, ${this.city}, ${this.state} ${this.zip_code}, ${this.country}`;
  }

  async updateStatus(newStatus, reason = null) {
    const updates = { status: newStatus };
    
    if (newStatus === 'active' && this.status !== 'active') {
      updates.converted_at = new Date().toISOString();
    }
    
    if (newStatus === 'lost' && reason) {
      updates.lost_reason = reason;
    }
    
    return this.update(updates);
  }

  async updateLastContact() {
    return this.update({ last_contact_date: new Date().toISOString() });
  }

  async setNextFollowUp(date) {
    return this.update({ next_follow_up_date: date.toISOString() });
  }

  async addTag(tag) {
    const currentTags = this.tags || [];
    if (!currentTags.includes(tag)) {
      return this.update({ tags: [...currentTags, tag] });
    }
    return this;
  }

  async removeTag(tag) {
    const currentTags = this.tags || [];
    return this.update({ tags: currentTags.filter(t => t !== tag) });
  }

  isOverdue() {
    return this.next_follow_up_date && new Date(this.next_follow_up_date) < new Date();
  }

  // Class methods
  static async getByStatus(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options,
    }, 'clients');
  }

  static async getLeads(options = {}) {
    return this.getByStatus('lead', options);
  }

  static async getOpportunities(options = {}) {
    return this.getByStatus('opportunity', options);
  }

  static async getActiveClients(options = {}) {
    return this.getByStatus('active', options);
  }

  static async getAssignedTo(userId, options = {}) {
    return this.findAll({
      where: { assigned_to: userId },
      ...options,
    }, 'clients');
  }

  static async getOverdueFollowUps(options = {}) {
    const now = new Date().toISOString();
    return this.findAll({
      where: {
        next_follow_up_date: { lt: now },
        status: { in: ['lead', 'opportunity'] },
      },
      ...options,
    }, 'clients');
  }

  static async searchClients(searchTerm, options = {}) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`company_name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError.internal('Database error', error);
    }

    return data.map(client => new Client(client));
  }

  static async getConversionStats(startDate, endDate) {
    const totalLeads = await this.count({
      where: {
        created_at: { gte: startDate, lte: endDate },
        status: 'lead',
      },
    }, 'clients');
    
    const convertedClients = await this.count({
      where: {
        converted_at: { gte: startDate, lte: endDate },
        status: 'active',
      },
    }, 'clients');
    
    return {
      totalLeads,
      convertedClients,
      conversionRate: totalLeads > 0 ? (convertedClients / totalLeads) * 100 : 0,
    };
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'companyName': 'company_name',
      'contactPerson': 'contact_person',
      'alternatePhone': 'alternate_phone',
      'zipCode': 'zip_code',
      'assignedTo': 'assigned_to',
      'estimatedValue': 'estimated_value',
      'customFields': 'custom_fields',
      'socialMedia': 'social_media',
      'lastContactDate': 'last_contact_date',
      'nextFollowUpDate': 'next_follow_up_date',
      'convertedAt': 'converted_at',
      'lostReason': 'lost_reason',
      'preferredContactMethod': 'preferred_contact_method',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Client;