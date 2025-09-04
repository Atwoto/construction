// Re-export comprehensive client types
export * from './client';

// User and Authentication Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  phone?: string;
  address?: string;
  profilePicture?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'manager' | 'employee';
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  phone?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'employee';
  isActive?: boolean;
}

// Legacy Client Types (keeping for backward compatibility)
export interface LegacyClient {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  status: 'lead' | 'opportunity' | 'active' | 'inactive' | 'lost';
  source?: 'website' | 'referral' | 'cold_call' | 'email' | 'social_media' | 'advertisement' | 'trade_show' | 'other';
  assignedTo?: number;
  rating?: number;
  estimatedValue?: number;
  notes?: string;
  tags: string[];
  lastContactDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  description?: string;
  projectNumber: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'maintenance';
  status: 'planning' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  budget: number;
  actualCost: number;
  estimatedRevenue?: number;
  actualRevenue: number;
  progress: number;
  clientId: number;
  projectManagerId: number;
  contractorId?: number;
  notes?: string;
  tags: string[];
  teamMembers: number[];
  weatherDependency?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  qualityScore?: number;
  clientSatisfaction?: number;
  createdAt: string;
  updatedAt: string;
  client?: import('./client').Client;
  projectManager?: User;
}

// Task Types
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: number;
  assignedTo?: number;
  createdBy: number;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours: number;
  progress: number;
  category?: string;
  location?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  project?: Project;
  assignedEmployee?: Employee;
}

// Employee Types
export interface Employee {
  id: number;
  employeeId: string;
  userId: number;
  department: 'management' | 'construction' | 'engineering' | 'administration' | 'sales' | 'finance' | 'hr' | 'safety';
  position: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'intern';
  status: 'active' | 'inactive' | 'terminated' | 'on_leave' | 'suspended';
  hireDate: string;
  terminationDate?: string;
  salary?: number;
  hourlyRate?: number;
  skills: string[];
  performanceRating?: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Invoice Types
export interface Invoice {
  id: number;
  invoiceNumber: string;
  type: 'invoice' | 'quote' | 'estimate' | 'credit_note';
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  clientId: number;
  projectId?: number;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  paymentTerms: string;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: import('./client').Client;
  project?: Project;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: any;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalEmployees: number;
  activeEmployees: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  averageProgress: number;
  totalBudget: number;
  totalActualCost: number;
  totalRevenue: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleCounts: {
    admin: number;
    manager: number;
    employee: number;
  };
}  

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Utility Types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error?: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: number;
  clientId?: number;
  projectId?: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

