export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  website?: string;
  industry?: string;
  companySize?: CompanySize;
  status: ClientStatus;
  source?: ClientSource;
  assignedTo?: string;
  assignedUser?: UserSummary;
  rating?: number;
  estimatedValue?: number;
  notes?: string;
  tags?: string[];
  lastContactDate?: string;
  nextFollowUpDate?: string;
  preferredContactMethod?: ContactMethod;
  timezone?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
  projects?: ProjectSummary[];
  contacts?: ClientContact[];
  customFields?: Record<string, any>;
}

// Client status enumeration
export type ClientStatus = 'lead' | 'opportunity' | 'active' | 'inactive' | 'lost';

// Client source enumeration
export type ClientSource = 
  | 'website' 
  | 'referral' 
  | 'cold_call' 
  | 'email' 
  | 'social_media' 
  | 'advertisement' 
  | 'trade_show' 
  | 'other';

// Company size enumeration
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+';

// Contact method enumeration
export type ContactMethod = 'email' | 'phone' | 'text' | 'in_person';

// Client contact role enumeration
export type ContactRole = 
  | 'primary'
  | 'billing'
  | 'technical'
  | 'decision_maker'
  | 'project_coordinator'
  | 'finance'
  | 'legal'
  | 'operations'
  | 'other';

// Contact preferred method enumeration
export type ContactPreferredMethod = 'email' | 'phone' | 'mobile' | 'text';

// Client contact interface
export interface ClientContact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  role: ContactRole;
  email: string;
  phone?: string;
  mobilePhone?: string;
  extension?: string;
  isPrimary: boolean;
  isActive: boolean;
  preferredContactMethod?: ContactPreferredMethod;
  timezone?: string;
  notes?: string;
  socialMedia?: Record<string, string>;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  birthday?: string;
  workAnniversary?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    companyName: string;
  };
  // Virtual property for full name
  name?: string;
}

// Client contact form data interface
export interface ClientContactFormData {
  id?: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  role: ContactRole;
  email: string;
  phone?: string;
  mobilePhone?: string;
  extension?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  preferredContactMethod?: ContactPreferredMethod;
  timezone?: string;
  notes?: string;
  socialMedia?: Record<string, string>;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  birthday?: string;
  workAnniversary?: string;
}

// Client contact list parameters
export interface ClientContactListParams {
  role?: ContactRole;
  isActive?: boolean;
  includeInactive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

// User summary interface for assigned users
export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
}

// Project summary interface for client projects
export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  budget: number;
  progress?: number;
  startDate?: string;
  estimatedEndDate?: string;
  projectManager?: UserSummary;
}

// Client creation data interface
export interface CreateClientData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  website?: string;
  industry?: string;
  companySize?: CompanySize;
  status?: ClientStatus;
  source?: ClientSource;
  assignedTo?: string;
  rating?: number;
  estimatedValue?: number;
  notes?: string;
  tags?: string[];
  lastContactDate?: string;
  nextFollowUpDate?: string;
  preferredContactMethod?: ContactMethod;
  timezone?: string;
  customFields?: Record<string, any>;
}

// Client update data interface
export type UpdateClientData = Partial<CreateClientData>;

// Client list parameters for filtering and pagination
export interface ClientListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ClientStatus | ClientStatus[];
  source?: ClientSource;
  companySize?: CompanySize;
  industry?: string;
  assignedTo?: string;
  rating?: number;
  sortBy?: ClientSortField;
  sortOrder?: 'ASC' | 'DESC';
  overdue?: boolean;
  convertedOnly?: boolean;
  tags?: string[];
  location?: string;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  lastContactBefore?: string;
  lastContactAfter?: string;
  createdBefore?: string;
  createdAfter?: string;
  // Project history filters
  hasProjects?: boolean | string;
  projectStatus?: string | string[];
  projectMinValue?: number;
  projectMaxValue?: number;
}

// Valid sort fields for clients
export type ClientSortField = 
  | 'companyName'
  | 'contactPerson'
  | 'email'
  | 'status'
  | 'source'
  | 'rating'
  | 'estimatedValue'
  | 'createdAt'
  | 'lastContactDate'
  | 'nextFollowUpDate';

// Client statistics interface
export interface ClientStats {
  totalClients: number;
  activeClients: number;
  leads: number;
  opportunities: number;
  inactiveClients: number;
  lostClients: number;
  overdueFollowUps: number;
  conversionRate: number;
  averageRating: number;
  totalEstimatedValue: number;
  clientsBySource: SourceStatistic[];
  clientsBySize: SizeStatistic[];
  clientsByStatus: StatusStatistic[];
  clientsByLocation: LocationStatistic[];
  monthlyConversions: MonthlyStatistic[];
  recentActivities: ClientActivity[];
}

// Source statistics
export interface SourceStatistic {
  source: ClientSource;
  count: number;
  percentage: number;
}

// Size statistics
export interface SizeStatistic {
  size: CompanySize;
  count: number;
  percentage: number;
}

// Status statistics
export interface StatusStatistic {
  status: ClientStatus;
  count: number;
  percentage: number;
}

// Location statistics
export interface LocationStatistic {
  location: string;
  count: number;
  percentage: number;
}

// Monthly statistics
export interface MonthlyStatistic {
  month: string;
  count: number;
  value?: number;
}

// Client activity interface
export interface ClientActivity {
  id: string;
  type: 'created' | 'updated' | 'status_changed' | 'contact_made' | 'follow_up_scheduled' | 'project_added';
  description: string;
  clientId: string;
  clientName: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Pagination interface
export interface ClientPagination {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

// Client list response interface
export interface ClientListResponse {
  clients: Client[];
  pagination: ClientPagination;
}

// Client form data interface
export interface ClientFormData extends CreateClientData {
  id?: string;
}

// Client filter options interface
export interface ClientFilterOptions {
  statuses: Array<{ value: ClientStatus; label: string; count?: number }>;
  sources: Array<{ value: ClientSource; label: string; count?: number }>;
  companySizes: Array<{ value: CompanySize; label: string; count?: number }>;
  assignedUsers: Array<{ value: string; label: string; count?: number }>;
  industries: Array<{ value: string; label: string; count?: number }>;
  locations: Array<{ value: string; label: string; count?: number }>;
}

// Client validation rules
export interface ClientValidationRules {
  companyName: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  contactPerson: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  email: {
    required: boolean;
    pattern: RegExp;
  };
  phone: {
    required: boolean;
    pattern: RegExp;
  };
  website: {
    pattern: RegExp;
  };
  estimatedValue: {
    min: number;
    max: number;
  };
  notes: {
    maxLength: number;
  };
}



// Client document interface
export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: 'contract' | 'proposal' | 'invoice' | 'receipt' | 'license' | 'other';
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
  description?: string;
}

// Client note interface
export interface ClientNote {
  id: string;
  clientId: string;
  content: string;
  type: 'general' | 'meeting' | 'phone_call' | 'email' | 'reminder';
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  author?: UserSummary;
}

// Client follow-up interface
export interface ClientFollowUp {
  id: string;
  clientId: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'demo' | 'other';
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
  notes?: string;
  assignedTo: string;
  assignedUser?: UserSummary;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Client import/export interfaces
export interface ClientImportData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  [key: string]: any;
}

export interface ClientExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  fields: string[];
  filters?: ClientListParams;
  includeProjects?: boolean;
  includeContacts?: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Form state interfaces
export interface ClientFormState {
  data: ClientFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface ClientListState {
  clients: Client[];
  pagination: ClientPagination;
  filters: ClientListParams;
  loading: boolean;
  error: string | null;
  selectedClients: string[];
}

export interface ClientDetailsState {
  client: Client | null;
  contacts: ClientContact[];
  documents: ClientDocument[];
  notes: ClientNote[];
  followUps: ClientFollowUp[];
  activities: ClientActivity[];
  loading: boolean;
  error: string | null;
}

// Component prop interfaces
export interface ClientCardProps {
  client: Client;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onUpdateStatus?: (client: Client, status: ClientStatus) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface ClientTableProps {
  clients: Client[];
  loading?: boolean;
  pagination: ClientPagination;
  onPageChange: (page: number) => void;
  onEdit?: (client: Client) => void;
  onView?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onUpdateStatus?: (client: Client, status: ClientStatus) => void;
  currentUserId?: string;
  sortBy?: ClientSortField;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (field: ClientSortField, order: 'ASC' | 'DESC') => void;
  selectedClients?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface ClientFormProps {
  client?: Client;
  isEdit?: boolean;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  assignedUsers: UserSummary[];
  loading?: boolean;
}

export interface ClientFiltersProps {
  filters: ClientListParams;
  onFilterChange: (filters: Partial<ClientListParams>) => void;
  onReset: () => void;
  assignedUsers: UserSummary[];
  loading?: boolean;
  filterOptions?: ClientFilterOptions;
}

export interface ClientStatsProps {
  stats: ClientStats | null;
  loading?: boolean;
  error?: string | null;
}

// Hook return types
export interface UseClientsReturn {
  clients: Client[];
  pagination: ClientPagination;
  loading: boolean;
  error: string | null;
  filters: ClientListParams;
  setFilters: (filters: Partial<ClientListParams>) => void;
  refresh: () => Promise<void>;
}

export interface UseClientReturn {
  client: Client | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateClient: (data: UpdateClientData) => Promise<void>;
  updateStatus: (status: ClientStatus, reason?: string) => Promise<void>;
}

export interface UseClientStatsReturn {
  stats: ClientStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Constants
export const CLIENT_STATUSES: Array<{ value: ClientStatus; label: string; color: string }> = [
  { value: 'lead', label: 'Lead', color: 'blue' },
  { value: 'opportunity', label: 'Opportunity', color: 'yellow' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'lost', label: 'Lost', color: 'red' },
];

export const CLIENT_SOURCES: Array<{ value: ClientSource; label: string }> = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'email', label: 'Email' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'trade_show', label: 'Trade Show' },
  { value: 'other', label: 'Other' },
];

export const COMPANY_SIZES: Array<{ value: CompanySize; label: string }> = [
  { value: '1-10', label: 'Small (1-10)' },
  { value: '11-50', label: 'Medium (11-50)' },
  { value: '51-200', label: 'Large (51-200)' },
  { value: '201-500', label: 'Enterprise (201-500)' },
  { value: '500+', label: 'Corporation (500+)' },
];

export const CONTACT_METHODS: Array<{ value: ContactMethod; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text' },
  { value: 'in_person', label: 'In Person' },
];

export const CONTACT_ROLES: Array<{ value: ContactRole; label: string; description: string }> = [
  { value: 'primary', label: 'Primary Contact', description: 'Main point of contact' },
  { value: 'billing', label: 'Billing Contact', description: 'Handles billing and payments' },
  { value: 'technical', label: 'Technical Contact', description: 'Technical requirements and specifications' },
  { value: 'decision_maker', label: 'Decision Maker', description: 'Final decision authority' },
  { value: 'project_coordinator', label: 'Project Coordinator', description: 'Project coordination and management' },
  { value: 'finance', label: 'Finance', description: 'Financial matters and budgets' },
  { value: 'legal', label: 'Legal', description: 'Legal and contractual matters' },
  { value: 'operations', label: 'Operations', description: 'Day-to-day operations' },
  { value: 'other', label: 'Other', description: 'Other role not specified' },
];

export const CONTACT_PREFERRED_METHODS: Array<{ value: ContactPreferredMethod; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'text', label: 'Text/SMS' },
];

export const CLIENT_SORT_FIELDS: Array<{ value: ClientSortField; label: string }> = [
  { value: 'companyName', label: 'Company Name' },
  { value: 'contactPerson', label: 'Contact Person' },
  { value: 'email', label: 'Email' },
  { value: 'status', label: 'Status' },
  { value: 'source', label: 'Source' },
  { value: 'rating', label: 'Rating' },
  { value: 'estimatedValue', label: 'Estimated Value' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'lastContactDate', label: 'Last Contact' },
  { value: 'nextFollowUpDate', label: 'Next Follow-up' },
];

// Default values
export const DEFAULT_CLIENT_FILTERS: ClientListParams = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
};

export const DEFAULT_CLIENT_FORM_DATA: Partial<ClientFormData> = {
  status: 'lead',
  companySize: '1-10',
  source: 'website',
  preferredContactMethod: 'email',
  rating: 3,
  tags: [],
  country: 'United States',
};