const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Project = require('../models/Project');
const User = require('../models/User');
const { supabase } = require('../config/supabase');
const { createError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all invoices with filtering, sorting, and pagination
 */
const getInvoices = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      clientId,
      projectId,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      startDate,
      endDate,
      overdue = false
    } = req.query;

    const offset = (page - 1) * limit;
    let query = supabase
      .from('invoices')
      .select(`
        *,
        client:clients(id, company_name, contact_person, email),
        project:projects(id, name)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);
    if (clientId) query = query.eq('client_id', clientId);
    if (projectId) query = query.eq('project_id', projectId);

    // Date range filter
    if (startDate) query = query.gte('issue_date', new Date(startDate).toISOString());
    if (endDate) query = query.lte('issue_date', new Date(endDate).toISOString());

    // Search filter
    if (search) {
      query = query.or(`invoice_number.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    // Overdue filter
    if (overdue === 'true') {
      const now = new Date().toISOString();
      query = query.lt('due_date', now);
      query = query.in('status', ['sent', 'pending', 'overdue']);
    }

    // Apply sorting
    const validSortFields = [
      'invoice_number',
      'type',
      'status',
      'issue_date',
      'due_date',
      'total',
      'created_at'
    ];

    const orderField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) 
      ? sortOrder.toLowerCase() 
      : 'desc';

    query = query.order(orderField, { ascending: orderDirection === 'asc' });

    const { data: invoices, count, error } = await query;

    if (error) {
      throw createError.internal('Error fetching invoices', error);
    }

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.json({
      invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalInvoices: count,
        hasNext,
        hasPrev,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    throw error;
  }
});

/**
 * Get invoice by ID
 */
const getInvoiceById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(id, company_name, contact_person, email, address),
        project:projects(id, name, description),
        created_by_user:users!created_by(id, first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError.notFound('Invoice not found');
      }
      throw createError.internal('Error fetching invoice', error);
    }

    res.json(invoice);
  } catch (error) {
    logger.error('Error fetching invoice:', error);
    throw error;
  }
});

/**
 * Create new invoice
 */
const createInvoice = asyncHandler(async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Set createdBy to current user if not specified
    if (!invoiceData.created_by) {
      invoiceData.created_by = req.user.id;
    }

    const invoice = await Invoice.create(invoiceData);

    // Fetch the created invoice with client and project
    const { data: createdInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(id, company_name, contact_person, email),
        project:projects(id, name)
      `)
      .eq('id', invoice.id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching created invoice', fetchError);
    }

    res.status(201).json(createdInvoice);
  } catch (error) {
    logger.error('Error creating invoice:', error);
    throw error;
  }
});

/**
 * Update invoice
 */
const updateInvoice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw createError.notFound('Invoice not found');
    }

    await invoice.update(updateData);

    // Fetch updated invoice with client and project
    const { data: updatedInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(id, company_name, contact_person, email),
        project:projects(id, name)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated invoice', fetchError);
    }

    res.json(updatedInvoice);
  } catch (error) {
    logger.error('Error updating invoice:', error);
    throw error;
  }
});

/**
 * Delete invoice
 */
const deleteInvoice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw createError.notFound('Invoice not found');
    }

    // Prevent deleting paid invoices
    if (invoice.status === 'paid') {
      throw createError.badRequest('Cannot delete paid invoice');
    }

    await invoice.delete();

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    logger.error('Error deleting invoice:', error);
    throw error;
  }
});

/**
 * Mark invoice as sent
 */
const markAsSent = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw createError.notFound('Invoice not found');
    }

    await invoice.markAsSent();

    const { data: updatedInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated invoice', fetchError);
    }

    res.json({
      message: 'Invoice marked as sent successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    logger.error('Error marking invoice as sent:', error);
    throw error;
  }
});

/**
 * Mark invoice as paid
 */
const markAsPaid = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw createError.notFound('Invoice not found');
    }

    await invoice.markAsPaid(amount, paymentMethod);

    const { data: updatedInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated invoice', fetchError);
    }

    res.json({
      message: 'Invoice marked as paid successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    logger.error('Error marking invoice as paid:', error);
    throw error;
  }
});

/**
 * Send reminder for invoice
 */
const sendReminder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw createError.notFound('Invoice not found');
    }

    await invoice.sendReminder();

    const { data: updatedInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated invoice', fetchError);
    }

    res.json({
      message: 'Reminder sent successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    logger.error('Error sending reminder:', error);
    throw error;
  }
});

/**
 * Get invoice statistics
 */
const getInvoiceStats = asyncHandler(async (req, res) => {
  try {
    const {
      startDate = new Date(new Date().getFullYear(), 0, 1), // Start of current year
      endDate = new Date() // Current date
    } = req.query;

    const stats = await Invoice.getFinancialSummary(new Date(startDate), new Date(endDate));

    // Get invoices by status
    const { data: invoicesByStatus, error: statusError } = await supabase
      .from('invoices')
      .select('status,count')
      .group('status');

    if (statusError) {
      throw createError.internal('Error getting invoices by status', statusError);
    }

    // Get invoices by type
    const { data: invoicesByType, error: typeError } = await supabase
      .from('invoices')
      .select('type,count')
      .group('type');

    if (typeError) {
      throw createError.internal('Error getting invoices by type', typeError);
    }

    res.json({
      ...stats,
      invoicesByStatus: invoicesByStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count)
      })),
      invoicesByType: invoicesByType.map(item => ({
        type: item.type,
        count: parseInt(item.count)
      }))
    });
  } catch (error) {
    logger.error('Error fetching invoice statistics:', error);
    throw error;
  }
});

/**
 * Get overdue invoices
 */
const getOverdueInvoices = asyncHandler(async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const invoices = await Invoice.getOverdueInvoices({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: ['due_date', 'asc']
    });

    res.json({ invoices });
  } catch (error) {
    logger.error('Error fetching overdue invoices:', error);
    throw error;
  }
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markAsSent,
  markAsPaid,
  sendReminder,
  getInvoiceStats,
  getOverdueInvoices,
};