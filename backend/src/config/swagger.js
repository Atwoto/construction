const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Construction CRM API',
      version: '1.0.0',
      description: 'A comprehensive Construction CRM API for managing all aspects of construction business operations',
      contact: {
        name: 'Construction CRM Team',
        email: 'support@constructioncrm.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization header using the Bearer scheme. Enter your token in the text input below.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'string',
              description: 'Detailed error information',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page',
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'employee'],
              description: 'User role',
            },
            isActive: {
              type: 'boolean',
              description: 'User active status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Client ID',
            },
            companyName: {
              type: 'string',
              description: 'Client company name',
            },
            contactPerson: {
              type: 'string',
              description: 'Primary contact person',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Client email address',
            },
            phone: {
              type: 'string',
              description: 'Client phone number',
            },
            address: {
              type: 'string',
              description: 'Client address',
            },
            status: {
              type: 'string',
              enum: ['lead', 'opportunity', 'active', 'inactive'],
              description: 'Client status',
            },
            assignedTo: {
              type: 'integer',
              description: 'ID of assigned user',
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Project ID',
            },
            name: {
              type: 'string',
              description: 'Project name',
            },
            description: {
              type: 'string',
              description: 'Project description',
            },
            status: {
              type: 'string',
              enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'],
              description: 'Project status',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Project start date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Project end date',
            },
            budget: {
              type: 'number',
              format: 'decimal',
              description: 'Project budget',
            },
            actualCost: {
              type: 'number',
              format: 'decimal',
              description: 'Actual project cost',
            },
            progress: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
              description: 'Project progress percentage',
            },
            clientId: {
              type: 'integer',
              description: 'Client ID',
            },
            projectManagerId: {
              type: 'integer',
              description: 'Project manager user ID',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Clients',
        description: 'Client management operations',
      },
      {
        name: 'Projects',
        description: 'Project management operations',
      },
      {
        name: 'Invoices',
        description: 'Invoice and financial operations',
      },
      {
        name: 'Employees',
        description: 'Employee management operations',
      },
      {
        name: 'Inventory',
        description: 'Inventory and material management',
      },
      {
        name: 'Documents',
        description: 'Document management operations',
      },
      {
        name: 'Reports',
        description: 'Reporting and analytics operations',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js',
  ],
};

module.exports = swaggerOptions;