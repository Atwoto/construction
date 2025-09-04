const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Invoice model for Supabase
 */
class Invoice extends BaseModel {
  constructor(data) {
    super(data, 'invoices');
  }

  // Instance methods
  calculateTotals() {
    let subtotal = 0;
    
    // Calculate subtotal from items
    if (this.items && Array.isArray(this.items)) {
      subtotal = this.items.reduce((sum, item) => {
        const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
        return sum + itemTotal;
      }, 0);
    } else {
      subtotal = parseFloat(this.subtotal || 0);
    }
    
    // Calculate discount
    const discountAmount = subtotal * parseFloat(this.discount_rate || 0);
    const afterDiscount = subtotal - discountAmount;
    
    // Calculate tax
    const taxAmount = afterDiscount * parseFloat(this.tax_rate || 0);
    
    // Calculate total
    const total = afterDiscount + taxAmount;
    const amountDue = total - parseFloat(this.amount_paid || 0);
    
    this.subtotal = subtotal.toFixed(2);
    this.discount_amount = discountAmount.toFixed(2);
    this.tax_amount = taxAmount.toFixed(2);
    this.total = total.toFixed(2);
    this.amount_due = Math.max(0, amountDue).toFixed(2);
  }

  addItem(item) {
    const newItem = {
      id: Date.now(),
      description: item.description,
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      total: (item.quantity || 1) * (item.unit_price || 0),
      ...item,
    };
    
    this.items = [...(this.items || []), newItem];
    this.calculateTotals();
    return this;
  }

  updateItem(itemId, updates) {
    this.items = (this.items || []).map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    this.calculateTotals();
    return this;
  }

  removeItem(itemId) {
    this.items = (this.items || []).filter(item => item.id !== itemId);
    this.calculateTotals();
    return this;
  }

  async markAsSent() {
    return this.update({
      status: 'sent',
      sent_at: new Date().toISOString(),
    });
  }

  async markAsPaid(amount = null, paymentMethod = null) {
    const paidAmount = amount || parseFloat(this.total);
    const totalPaid = parseFloat(this.amount_paid || 0) + paidAmount;
    
    const updates = {
      amount_paid: totalPaid.toFixed(2),
      amount_due: Math.max(0, parseFloat(this.total) - totalPaid).toFixed(2),
    };
    
    if (totalPaid >= parseFloat(this.total)) {
      updates.status = 'paid';
      updates.paid_at: new Date().toISOString(),
    }
    
    if (paymentMethod) {
      updates.payment_method = paymentMethod;
    }
    
    return this.update(updates);
  }

  isOverdue() {
    return new Date(this.due_date) < new Date() && this.status !== 'paid' && this.status !== 'cancelled';
  }

  getDaysOverdue() {
    if (!this.isOverdue()) return 0;
    const today = new Date();
    const dueDate = new Date(this.due_date);
    const diffTime = today - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async sendReminder() {
    return this.update({
      last_reminder_sent: new Date().toISOString(),
      reminder_count: (this.reminder_count || 0) + 1,
    });
  }

  async convertToInvoice() {
    if (this.type !== 'quote' && this.type !== 'estimate') {
      throw new Error('Only quotes and estimates can be converted to invoices');
    }
    
    return this.update({
      type: 'invoice',
      status: 'draft',
      issue_date: new Date().toISOString(),
    });
  }

  // Class methods
  static async getByStatus(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options,
    }, 'invoices');
  }

  static async getByType(type, options = {}) {
    return this.findAll({
      where: { type },
      ...options,
    }, 'invoices');
  }

  static async getOverdueInvoices(options = {}) {
    const now = new Date().toISOString();
    return this.findAll({
      where: {
        due_date: { lt: now },
        status: { in: ['sent', 'pending', 'overdue'] },
      },
      ...options,
    }, 'invoices');
  }

  static async getByClient(clientId, options = {}) {
    return this.findAll({
      where: { client_id: clientId },
      ...options,
    }, 'invoices');
  }

  static async getByProject(projectId, options = {}) {
    return this.findAll({
      where: { project_id: projectId },
      ...options,
    }, 'invoices');
  }

  static async getFinancialSummary(startDate, endDate) {
    const invoices = await this.findAll({
      where: {
        issue_date: { gte: startDate, lte: endDate },
        type: 'invoice',
      },
    }, 'invoices');
    
    const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount_paid || 0), 0);
    const totalOutstanding = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount_due || 0), 0);
    
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const overdueInvoices = invoices.filter(inv => inv.isOverdue()).length;
    
    return {
      totalInvoices: invoices.length,
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      paidInvoices,
      overdueInvoices,
      collectionRate: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0,
    };
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = {
      'invoiceNumber': 'invoice_number',
      'clientId': 'client_id',
      'projectId': 'project_id',
      'issueDate': 'issue_date',
      'dueDate': 'due_date',
      'validUntil': 'valid_until',
      'taxRate': 'tax_rate',
      'taxAmount': 'tax_amount',
      'discountRate': 'discount_rate',
      'discountAmount': 'discount_amount',
      'amountPaid': 'amount_paid',
      'amountDue': 'amount_due',
      'paymentTerms': 'payment_terms',
      'paymentMethod': 'payment_method',
      'createdBy': 'created_by',
      'sentAt': 'sent_at',
      'paidAt': 'paid_at',
      'lastReminderSent': 'last_reminder_sent',
      'reminderCount': 'reminder_count',
      'parentInvoiceId': 'parent_invoice_id',
      'recurringSchedule': 'recurring_schedule',
      'billingAddress': 'billing_address',
      'shippingAddress': 'shipping_address',
      'internalNotes': 'internal_notes',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = Invoice;