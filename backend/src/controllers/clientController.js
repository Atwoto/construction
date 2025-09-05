const Client = require('../models/Client');
const Project = require('../models/Project');
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
 * Get all clients with filtering, sorting, and pagination
 */
const getClients = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      source,
      companySize,
      industry,
      assignedTo,
      rating,
      sortBy = 'created_at',
      sortOrder = 'desc',
      overdue = false,
      convertedOnly = false,
      // Advanced filters
      location,
      estimatedValueMin,
      estimatedValueMax,
      createdAfter,
      createdBefore,
      lastContactAfter,
      lastContactBefore,
      tags,
      hasProjects,
      projectStatus,
      projectMinValue,
      projectMaxValue,
    } = req.query;

    const offset = (page - 1) * limit;
    let query = supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);

    // Search functionality
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,industry.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`);
    }

    // Status filter
    if (status) {
      if (Array.isArray(status)) {
        query = query.in('status', status);
      } else {
        query = query.eq('status', status);
      }
    }

    // Source filter
    if (source) {
      query = query.eq('source', source);
    }

    // Company size filter
    if (companySize) {
      query = query.eq('company_size', companySize);
    }

    // Industry filter
    if (industry) {
      query = query.ilike('industry', `%${industry}%`);
    }

    // Assigned to filter
    if (assignedTo) {
      if (assignedTo === '0') {
        query = query.is('assigned_to', null);
      } else {
        query = query.eq('assigned_to', assignedTo);
      }
    }

    // Rating filter
    if (rating) {
      query = query.gte('rating', parseInt(rating));
    }

    // Location filter (searches city, state, address)
    if (location) {
      query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%,address.ilike.%${location}%`);
    }

    // Estimated value range filters
    if (estimatedValueMin) {
      query = query.gte('estimated_value', parseFloat(estimatedValueMin));
    }
    if (estimatedValueMax) {
      query = query.lte('estimated_value', parseFloat(estimatedValueMax));
    }

    // Date range filters
    if (createdAfter) {
      query = query.gte('created_at', new Date(createdAfter).toISOString());
    }
    if (createdBefore) {
      query = query.lte('created_at', new Date(createdBefore).toISOString());
    }
    if (lastContactAfter) {
      query = query.gte('last_contact_date', new Date(lastContactAfter).toISOString());
    }
    if (lastContactBefore) {
      query = query.lte('last_contact_date', new Date(lastContactBefore).toISOString());
    }

    // Tags filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      // For array contains, we need to use the 'cs' (contains) operator
      query = query.cs('tags', tagsArray);
    }

    // Overdue follow-ups filter
    if (overdue === 'true') {
      const now = new Date().toISOString();
      query = query.lt('next_follow_up_date', now);
      query = query.in('status', ['lead', 'opportunity']);
    }

    // Converted clients only
    if (convertedOnly === 'true') {
      query = query.not('converted_at', 'is', null);
    }

    // Valid sort fields
    const validSortFields = [
      'company_name',
      'contact_person',
      'email',
      'status',
      'source',
      'rating',
      'estimated_value',
      'created_at',
      'last_contact_date',
      'next_follow_up_date',
    ];

    const orderField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const orderDirection = ['asc', 'desc'].includes(sortOrder.toLowerCase()) 
      ? sortOrder.toLowerCase() 
      : 'desc';

    query = query.order(orderField, { ascending: orderDirection === 'asc' });

    const { data: clients, count, error } = await query;

    if (error) {
      throw createError.internal('Error fetching clients', error);
    }

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.json({
      data: {
        clients: toCamelCase(clients),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalClients: count,
          hasNext,
          hasPrev,
          limit: parseInt(limit),
        },
      }
    });
  } catch (error) {
    logger.error('Error fetching clients:', error);
    throw error;
  }
});

/**
 * Get client by ID
 */
const getClientById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the basic client data
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError.notFound('Client not found');
      }
      throw createError.internal('Error fetching client', error);
    }

    // Get assigned user if exists
    let assignedUser = null;
    if (client.assigned_to) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('id', client.assigned_to)
        .single();
      
      if (!userError && user) {
        assignedUser = user;
      }
    }

    // Get client contacts
    const { data: contacts, error: contactsError } = await supabaseAdmin
      .from('client_contacts')
      .select('*')
      .eq('client_id', id)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    // Get projects (basic info only)
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('id, name, status, budget, progress, start_date, estimated_end_date')
      .eq('client_id', id);

    // Combine the data
    const clientData = {
      ...toCamelCase(client),
      assignedUser: assignedUser ? toCamelCase(assignedUser) : null,
      contacts: contacts ? toCamelCase(contacts) : [],
      projects: projects ? toCamelCase(projects) : []
    };

    res.json({ data: clientData });
  } catch (error) {
    logger.error('Error fetching client:', error);
    throw error;
  }
});

/**
 * Create new client
 */
const createClient = asyncHandler(async (req, res) => {
  try {
    const clientData = req.body;
    
    // Convert camelCase to snake_case for database
    const dbClientData = {
      company_name: clientData.companyName,
      contact_person: clientData.contactPerson,
      email: clientData.email,
      phone: clientData.phone,
      alternate_phone: clientData.alternatePhone,
      address: clientData.address,
      city: clientData.city,
      state: clientData.state,
      zip_code: clientData.zipCode,
      country: clientData.country || 'United States',
      website: clientData.website,
      industry: clientData.industry,
      company_size: clientData.companySize,
      status: clientData.status || 'lead',
      source: clientData.source || 'website',
      assigned_to: clientData.assignedTo || req.user.id,
      rating: clientData.rating,
      estimated_value: clientData.estimatedValue,
      notes: clientData.notes,
      tags: clientData.tags || [],
      last_contact_date: clientData.lastContactDate,
      next_follow_up_date: clientData.nextFollowUpDate,
      preferred_contact_method: clientData.preferredContactMethod || 'email',
      timezone: clientData.timezone || 'America/New_York',
    };

    // Insert client into database
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .insert([dbClientData])
      .select()
      .single();

    if (error) {
      throw createError.internal('Error creating client', error);
    }

    // Get assigned user if exists
    let assignedUser = null;
    if (client.assigned_to) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('id', client.assigned_to)
        .single();
      
      if (!userError && user) {
        assignedUser = user;
      }
    }

    // Combine the data with camelCase conversion
    const clientResponse = {
      ...toCamelCase(client),
      assignedUser: assignedUser ? toCamelCase(assignedUser) : null
    };

    res.status(201).json({ data: clientResponse });
  } catch (error) {
    logger.error('Error creating client:', error);
    throw error;
  }
});

/**
 * Update client
 */
const updateClient = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const clientData = req.body;

    // Convert camelCase to snake_case for database
    const dbUpdateData = {
      company_name: clientData.companyName,
      contact_person: clientData.contactPerson,
      email: clientData.email,
      phone: clientData.phone,
      alternate_phone: clientData.alternatePhone,
      address: clientData.address,
      city: clientData.city,
      state: clientData.state,
      zip_code: clientData.zipCode,
      country: clientData.country,
      website: clientData.website,
      industry: clientData.industry,
      company_size: clientData.companySize,
      status: clientData.status,
      source: clientData.source,
      assigned_to: clientData.assignedTo,
      rating: clientData.rating,
      estimated_value: clientData.estimatedValue,
      notes: clientData.notes,
      tags: clientData.tags,
      last_contact_date: clientData.lastContactDate,
      next_follow_up_date: clientData.nextFollowUpDate,
      preferred_contact_method: clientData.preferredContactMethod,
      timezone: clientData.timezone,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(dbUpdateData).forEach(key => {
      if (dbUpdateData[key] === undefined) {
        delete dbUpdateData[key];
      }
    });

    // Update client in database
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError.notFound('Client not found');
      }
      throw createError.internal('Error updating client', error);
    }

    // Get assigned user if exists
    let assignedUser = null;
    if (client.assigned_to) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('id', client.assigned_to)
        .single();
      
      if (!userError && user) {
        assignedUser = user;
      }
    }

    // Get projects (basic info only)
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('id, name, status, budget')
      .eq('client_id', id);

    // Combine the data with camelCase conversion
    const clientResponse = {
      ...toCamelCase(client),
      assignedUser: assignedUser ? toCamelCase(assignedUser) : null,
      projects: projects ? toCamelCase(projects) : []
    };

    res.json({ data: clientResponse });
  } catch (error) {
    logger.error('Error updating client:', error);
    throw error;
  }
});

/**
 * Delete client
 */
const deleteClient = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Check if client exists
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('id', id)
      .single();

    if (clientError || !client) {
      throw createError.notFound('Client not found');
    }

    // Check if client has active projects
    const { count: activeProjects, error: countError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', id)
      .not('status', 'eq', 'completed');

    if (countError) {
      throw createError.internal('Error checking client projects', countError);
    }

    if (activeProjects > 0) {
      throw createError.badRequest('Cannot delete client with active projects');
    }

    // Delete client from database
    const { error: deleteError } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw createError.internal('Error deleting client', deleteError);
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    logger.error('Error deleting client:', error);
    throw error;
  }
});

/**
 * Update client status
 */
const updateClientStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Update client status in database
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add lost_reason if status is 'lost'
    if (status === 'lost' && reason) {
      updateData.lost_reason = reason;
    }

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError.notFound('Client not found');
      }
      throw createError.internal('Error updating client status', error);
    }

    // Get assigned user if exists
    let assignedUser = null;
    if (client.assigned_to) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('id', client.assigned_to)
        .single();
      
      if (!userError && user) {
        assignedUser = user;
      }
    }

    // Combine the data with camelCase conversion
    const clientResponse = {
      ...toCamelCase(client),
      assignedUser: assignedUser ? toCamelCase(assignedUser) : null
    };

    res.json({
      data: {
        message: 'Client status updated successfully',
        client: clientResponse
      }
    });
  } catch (error) {
    logger.error('Error updating client status:', error);
    throw error;
  }
});

/**
 * Update last contact date
 */
const updateLastContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      throw createError.notFound('Client not found');
    }

    await client.updateLastContact();

    const { data: updatedClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated client', fetchError);
    }

    res.json({
      message: 'Last contact date updated successfully',
      client: updatedClient
    });
  } catch (error) {
    logger.error('Error updating last contact:', error);
    throw error;
  }
});

/**
 * Set next follow-up date
 */
const setNextFollowUp = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { nextFollowUpDate } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      throw createError.notFound('Client not found');
    }

    await client.setNextFollowUp(new Date(nextFollowUpDate));

    const { data: updatedClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated client', fetchError);
    }

    res.json({
      message: 'Next follow-up date set successfully',
      client: updatedClient
    });
  } catch (error) {
    logger.error('Error setting next follow-up:', error);
    throw error;
  }
});

/**
 * Get client statistics
 */
const getClientStats = asyncHandler(async (req, res) => {
  try {
    // Get counts for different statuses
    const { count: totalClients, error: totalError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw createError.internal('Error counting total clients', totalError);
    }

    const { count: activeClients, error: activeError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (activeError) {
      throw createError.internal('Error counting active clients', activeError);
    }

    const { count: leads, error: leadsError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'lead');

    if (leadsError) {
      throw createError.internal('Error counting leads', leadsError);
    }

    const { count: opportunities, error: opportunitiesError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'opportunity');

    if (opportunitiesError) {
      throw createError.internal('Error counting opportunities', opportunitiesError);
    }

    const { count: inactiveClients, error: inactiveError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'inactive');

    if (inactiveError) {
      throw createError.internal('Error counting inactive clients', inactiveError);
    }

    const { count: lostClients, error: lostError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'lost');

    if (lostError) {
      throw createError.internal('Error counting lost clients', lostError);
    }

    // Overdue follow-ups
    const now = new Date().toISOString();
    const { count: overdueFollowUps, error: overdueError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .lt('next_follow_up_date', now)
      .in('status', ['lead', 'opportunity']);

    if (overdueError) {
      throw createError.internal('Error counting overdue follow-ups', overdueError);
    }

    // Clients by source - simplified approach
    const { data: allClients, error: allClientsError } = await supabaseAdmin
      .from('clients')
      .select('source, company_size, status, city, rating, estimated_value');

    if (allClientsError) {
      throw createError.internal('Error fetching client data for statistics', allClientsError);
    }

    // Calculate statistics from the data
    const clientsBySource = {};
    const clientsBySize = {};
    const clientsByStatus = {};
    const clientsByLocation = {};
    let totalEstimatedValue = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    allClients.forEach(client => {
      // By source
      clientsBySource[client.source] = (clientsBySource[client.source] || 0) + 1;
      
      // By size
      if (client.company_size) {
        clientsBySize[client.company_size] = (clientsBySize[client.company_size] || 0) + 1;
      }
      
      // By status
      clientsByStatus[client.status] = (clientsByStatus[client.status] || 0) + 1;
      
      // By location
      if (client.city) {
        clientsByLocation[client.city] = (clientsByLocation[client.city] || 0) + 1;
      }
      
      // Total estimated value
      if (client.estimated_value && ['lead', 'opportunity', 'active'].includes(client.status)) {
        totalEstimatedValue += parseFloat(client.estimated_value);
      }
      
      // Rating calculation
      if (client.rating) {
        ratingSum += parseFloat(client.rating);
        ratingCount++;
      }
    });

    // Average rating
    const avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

    // Conversion rate
    const totalLeadsAndOpportunities = leads + opportunities;
    const conversionRate = totalLeadsAndOpportunities > 0 
      ? (activeClients / (totalLeadsAndOpportunities + activeClients)) * 100 
      : 0;

    // Convert objects to arrays with percentages
    const clientsBySourceWithPercentage = Object.entries(clientsBySource).map(([source, count]) => {
      const percentage = totalClients > 0 ? (count / totalClients) * 100 : 0;
      return {
        source,
        count,
        percentage: Math.round(percentage * 100) / 100
      };
    });

    const clientsBySizeWithPercentage = Object.entries(clientsBySize).map(([size, count]) => {
      const percentage = totalClients > 0 ? (count / totalClients) * 100 : 0;
      return {
        size,
        count,
        percentage: Math.round(percentage * 100) / 100
      };
    });

    const clientsByStatusWithPercentage = Object.entries(clientsByStatus).map(([status, count]) => {
      const percentage = totalClients > 0 ? (count / totalClients) * 100 : 0;
      return {
        status,
        count,
        percentage: Math.round(percentage * 100) / 100
      };
    });

    const clientsByLocationWithPercentage = Object.entries(clientsByLocation).map(([location, count]) => {
      const percentage = totalClients > 0 ? (count / totalClients) * 100 : 0;
      return {
        location,
        count,
        percentage: Math.round(percentage * 100) / 100
      };
    });

    // Mock monthly conversions data (in a real app, this would come from the database)
    const monthlyConversions = [
      { month: "Jan 2023", count: 2, value: 1500000 },
      { month: "Feb 2023", count: 1, value: 750000 },
      { month: "Mar 2023", count: 3, value: 2250000 },
      { month: "Apr 2023", count: 2, value: 1500000 },
      { month: "May 2023", count: 1, value: 750000 },
      { month: "Jun 2023", count: 2, value: 1500000 }
    ];

    // Mock recent activities (in a real app, this would come from the database)
    const recentActivities = [];

    res.json({
      data: {
        totalClients,
        activeClients,
        leads,
        opportunities,
        inactiveClients,
        lostClients,
        overdueFollowUps,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageRating: Math.round(avgRating * 100) / 100,
        totalEstimatedValue: parseFloat(totalEstimatedValue || 0),
        clientsBySource: clientsBySourceWithPercentage,
        clientsBySize: clientsBySizeWithPercentage,
        clientsByStatus: clientsByStatusWithPercentage,
        clientsByLocation: clientsByLocationWithPercentage,
        monthlyConversions,
        recentActivities
      }
    });
  } catch (error) {
    logger.error('Error fetching client statistics:', error);
    throw error;
  }
});

/**
 * Get clients for dropdown/selection
 */
const getClientsForSelect = asyncHandler(async (req, res) => {
  try {
    const { search, status = ['active', 'opportunity'] } = req.query;
    
    let query = supabaseAdmin
      .from('clients')
      .select('id, company_name, contact_person, email, phone');

    // Status filter
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      query = query.in('status', statusArray);
    }

    // Search filter
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_person.ilike.%${search}%`);
    }

    // Order and limit
    const { data: clients, error } = await query
      .order('company_name', { ascending: true })
      .limit(50);

    if (error) {
      throw createError.internal('Error fetching clients for select', error);
    }

    res.json(clients);
  } catch (error) {
    logger.error('Error fetching clients for select:', error);
    throw error;
  }
});

/**
 * Add tag to client
 */
const addTag = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      throw createError.notFound('Client not found');
    }

    await client.addTag(tag);

    const { data: updatedClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated client', fetchError);
    }

    res.json({
      message: 'Tag added successfully',
      client: updatedClient
    });
  } catch (error) {
    logger.error('Error adding tag:', error);
    throw error;
  }
});

/**
 * Remove tag from client
 */
const removeTag = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      throw createError.notFound('Client not found');
    }

    await client.removeTag(tag);

    const { data: updatedClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw createError.internal('Error fetching updated client', fetchError);
    }

    res.json({
      message: 'Tag removed successfully',
      client: updatedClient
    });
  } catch (error) {
    logger.error('Error removing tag:', error);
    throw error;
  }
});

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  updateLastContact,
  setNextFollowUp,
  getClientStats,
  getClientsForSelect,
  addTag,
  removeTag,
};