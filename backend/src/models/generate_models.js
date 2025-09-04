const fs = require('fs');
const path = require('path');

// Models to generate
const models = [
  {
    name: 'Invoice',
    table: 'invoices',
    fields: {
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
    }
  },
  {
    name: 'Task',
    table: 'tasks',
    fields: {
      'projectId': 'project_id',
      'assignedTo': 'assigned_to',
      'estimatedHours': 'estimated_hours',
      'actualHours': 'actual_hours',
      'startDate': 'start_date',
      'dueDate': 'due_date',
      'completedAt': 'completed_at',
      'priority': 'priority',
      'status': 'status',
      'tags': 'tags',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'Document',
    table: 'documents',
    fields: {
      'projectId': 'project_id',
      'clientId': 'client_id',
      'uploadedBy': 'uploaded_by',
      'fileName': 'file_name',
      'fileType': 'file_type',
      'fileSize': 'file_size',
      'storagePath': 'storage_path',
      'category': 'category',
      'version': 'version',
      'tags': 'tags',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'Communication',
    table: 'communications',
    fields: {
      'userId': 'user_id',
      'clientId': 'client_id',
      'projectId': 'project_id',
      'type': 'type',
      'subject': 'subject',
      'content': 'content',
      'direction': 'direction',
      'status': 'status',
      'priority': 'priority',
      'relatedTo': 'related_to',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'Material',
    table: 'materials',
    fields: {
      'supplierId': 'supplier_id',
      'name': 'name',
      'sku': 'sku',
      'unit': 'unit',
      'unitPrice': 'unit_price',
      'currency': 'currency',
      'category': 'category',
      'minStockLevel': 'min_stock_level',
      'currentStock': 'current_stock',
      'reorderPoint': 'reorder_point',
      'location': 'location',
      'specifications': 'specifications',
      'tags': 'tags',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'Supplier',
    table: 'suppliers',
    fields: {
      'companyName': 'company_name',
      'contactPerson': 'contact_person',
      'email': 'email',
      'phone': 'phone',
      'alternatePhone': 'alternate_phone',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'zipCode': 'zip_code',
      'country': 'country',
      'website': 'website',
      'industry': 'industry',
      'rating': 'rating',
      'paymentTerms': 'payment_terms',
      'notes': 'notes',
      'tags': 'tags',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'ClientContact',
    table: 'client_contacts',
    fields: {
      'clientId': 'client_id',
      'firstName': 'first_name',
      'lastName': 'last_name',
      'email': 'email',
      'phone': 'phone',
      'position': 'position',
      'department': 'department',
      'isPrimary': 'is_primary',
      'notes': 'notes',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'Timesheet',
    table: 'timesheets',
    fields: {
      'employeeId': 'employee_id',
      'projectId': 'project_id',
      'taskId': 'task_id',
      'date': 'date',
      'hours': 'hours',
      'description': 'description',
      'status': 'status',
      'approvedBy': 'approved_by',
      'approvedAt': 'approved_at',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  },
  {
    name: 'Expense',
    table: 'expenses',
    fields: {
      'projectId': 'project_id',
      'categoryId': 'category_id',
      'amount': 'amount',
      'currency': 'currency',
      'date': 'date',
      'description': 'description',
      'receiptUrl': 'receipt_url',
      'vendor': 'vendor',
      'status': 'status',
      'approvedBy': 'approved_by',
      'approvedAt': 'approved_at',
      'customFields': 'custom_fields',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    }
  }
];

// Generate model files
models.forEach(model => {
  const content = `const BaseModel = require('./BaseModel');
const { supabase } = require('../config/database');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * ${model.name} model for Supabase
 */
class ${model.name} extends BaseModel {
  constructor(data) {
    super(data, '${model.table}');
  }

  // Helper methods for field mapping
  static mapFieldName(fieldName) {
    const fieldMap = ${JSON.stringify(model.fields, null, 2)};
    
    return fieldMap[fieldName] || fieldName;
  }
}

module.exports = ${model.name};
`;

  const filePath = path.join(process.cwd(), 'src', 'models', `${model.name}.js`);
  fs.writeFileSync(filePath, content);
  console.log(`Generated ${model.name} model`);
});
