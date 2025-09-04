-- Create ENUM types first
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE client_status AS ENUM ('lead', 'opportunity', 'active', 'inactive', 'lost');
CREATE TYPE client_source AS ENUM ('website', 'referral', 'cold_call', 'email', 'social_media', 'advertisement', 'trade_show', 'other');
CREATE TYPE company_size AS ENUM ('1-10', '11-50', '51-200', '201-500', '500+');
CREATE TYPE project_type AS ENUM ('residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'maintenance');
CREATE TYPE project_status AS ENUM ('planning', 'approved', 'in_progress', 'on_hold', 'completed', 'cancelled');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'temporary', 'intern');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'terminated', 'on_leave', 'suspended');
CREATE TYPE invoice_type AS ENUM ('invoice', 'quote', 'estimate', 'credit_note');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled', 'refunded');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE document_category AS ENUM ('contract', 'blueprint', 'photo', 'report', 'other');
CREATE TYPE communication_type AS ENUM ('email', 'phone', 'meeting', 'note', 'other');
CREATE TYPE communication_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE timesheet_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role user_role DEFAULT 'employee',
  phone VARCHAR(20),
  address TEXT,
  profile_picture VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login_at TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'United States',
  website VARCHAR(255),
  industry VARCHAR(100),
  company_size company_size,
  status client_status DEFAULT 'lead',
  source client_source DEFAULT 'other',
  assigned_to INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  estimated_value DECIMAL(12, 2),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  last_contact_date TIMESTAMP,
  next_follow_up_date TIMESTAMP,
  converted_at TIMESTAMP,
  lost_reason VARCHAR(255),
  preferred_contact_method VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  project_number VARCHAR(50) UNIQUE NOT NULL,
  type project_type NOT NULL,
  status project_status DEFAULT 'planning',
  priority priority DEFAULT 'medium',
  start_date DATE NOT NULL,
  estimated_end_date DATE NOT NULL,
  actual_end_date DATE,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  budget DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2) DEFAULT 0,
  estimated_revenue DECIMAL(15, 2),
  actual_revenue DECIMAL(15, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  project_manager_id INTEGER REFERENCES users(id) NOT NULL,
  contractor_id INTEGER REFERENCES users(id),
  permits JSONB DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  materials JSONB DEFAULT '{}',
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  weather_dependency BOOLEAN DEFAULT false,
  risk_level risk_level DEFAULT 'low',
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
  client_satisfaction INTEGER CHECK (client_satisfaction >= 1 AND client_satisfaction <= 5),
  milestones JSONB DEFAULT '[]',
  team_members INTEGER[] DEFAULT '{}',
  approved_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) UNIQUE NOT NULL,
  department VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  employment_type employment_type DEFAULT 'full_time',
  status employee_status DEFAULT 'active',
  hire_date DATE NOT NULL,
  termination_date DATE,
  salary DECIMAL(10, 2),
  hourly_rate DECIMAL(8, 2),
  overtime_rate DECIMAL(8, 2),
  pay_frequency VARCHAR(20) DEFAULT 'bi_weekly',
  supervisor INTEGER REFERENCES employees(id),
  emergency_contact JSONB DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  licenses JSONB DEFAULT '[]',
  training_records JSONB DEFAULT '[]',
  performance_rating DECIMAL(3, 2) CHECK (performance_rating >= 0 AND performance_rating <= 5),
  last_review_date DATE,
  next_review_date DATE,
  vacation_days INTEGER DEFAULT 0,
  sick_days INTEGER DEFAULT 0,
  personal_days INTEGER DEFAULT 0,
  used_vacation_days INTEGER DEFAULT 0,
  used_sick_days INTEGER DEFAULT 0,
  used_personal_days INTEGER DEFAULT 0,
  work_schedule JSONB DEFAULT '{}',
  equipment JSONB DEFAULT '[]',
  safety_record JSONB DEFAULT '{"incidents": [], "trainingCompleted": [], "lastSafetyTraining": null}',
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  benefits JSONB DEFAULT '{}',
  banking_info JSONB DEFAULT '{}',
  tax_info JSONB DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  current_projects INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  type invoice_type DEFAULT 'invoice',
  status invoice_status DEFAULT 'draft',
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  valid_until DATE,
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 4) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  discount_rate DECIMAL(5, 4) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) DEFAULT 0,
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  amount_due DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  exchange_rate DECIMAL(10, 6) DEFAULT 1,
  payment_terms VARCHAR(100) DEFAULT 'Net 30',
  payment_method VARCHAR(50),
  items JSONB DEFAULT '[]',
  notes TEXT,
  internal_notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  billing_address JSONB DEFAULT '{}',
  shipping_address JSONB DEFAULT '{}',
  created_by INTEGER REFERENCES users(id),
  sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  last_reminder_sent TIMESTAMP,
  reminder_count INTEGER DEFAULT 0,
  parent_invoice_id INTEGER REFERENCES invoices(id),
  recurring_schedule JSONB,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  project_id INTEGER REFERENCES projects(id) NOT NULL,
  assigned_to INTEGER REFERENCES employees(id),
  estimated_hours DECIMAL(8, 2),
  actual_hours DECIMAL(8, 2),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMP,
  priority priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  client_id INTEGER REFERENCES clients(id),
  uploaded_by INTEGER REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  storage_path VARCHAR(500),
  category document_category DEFAULT 'other',
  version VARCHAR(20) DEFAULT '1.0',
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Communications table
CREATE TABLE communications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  client_id INTEGER REFERENCES clients(id),
  project_id INTEGER REFERENCES projects(id),
  type communication_type NOT NULL,
  subject VARCHAR(255),
  content TEXT,
  direction communication_direction DEFAULT 'outbound',
  status VARCHAR(50) DEFAULT 'sent',
  priority priority DEFAULT 'medium',
  related_to VARCHAR(100),
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Materials table
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE,
  unit VARCHAR(50),
  unit_price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  category VARCHAR(100),
  supplier_id INTEGER REFERENCES suppliers(id),
  min_stock_level INTEGER DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  location VARCHAR(100),
  specifications JSONB DEFAULT '{}',
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  alternate_phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'United States',
  website VARCHAR(255),
  industry VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  payment_terms VARCHAR(100),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client Contacts table
CREATE TABLE client_contacts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Timesheets table
CREATE TABLE timesheets (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  task_id INTEGER REFERENCES tasks(id),
  date DATE NOT NULL,
  hours DECIMAL(5, 2) NOT NULL,
  description TEXT,
  status timesheet_status DEFAULT 'pending',
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  category_id INTEGER,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  date DATE NOT NULL,
  description TEXT,
  receipt_url VARCHAR(500),
  vendor VARCHAR(100),
  status expense_status DEFAULT 'pending',
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_assigned_to ON clients(assigned_to);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_manager_id ON projects(project_manager_id);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_communications_client_id ON communications(client_id);
CREATE INDEX idx_communications_project_id ON communications(project_id);
CREATE INDEX idx_materials_supplier_id ON materials(supplier_id);
CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);
CREATE INDEX idx_timesheets_employee_id ON timesheets(employee_id);
CREATE INDEX idx_timesheets_project_id ON timesheets(project_id);
CREATE INDEX idx_expenses_project_id ON expenses(project_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;