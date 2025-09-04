import React, { useState } from 'react';
import { ProjectListParams } from '../../services/projectService';
import { Client, User } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

interface ProjectFiltersProps {
  filters: ProjectListParams;
  onFilterChange: (filters: Partial<ProjectListParams>) => void;
  onReset: () => void;
  clients?: Client[];
  users?: User[];
  loading?: boolean;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  clients = [],
  users = [],
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    type: filters.type || '',
    priority: filters.priority || '',
    clientId: filters.clientId?.toString() || '',
    projectManagerId: filters.projectManagerId?.toString() || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || ''
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm || undefined });
  };

  const handleQuickFilter = (key: keyof ProjectListParams, value: any) => {
    onFilterChange({ [key]: value || undefined });
  };

  const handleLocalFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyAdvancedFilters = () => {
    const advancedFilters: Partial<ProjectListParams> = {};
    
    if (localFilters.status) advancedFilters.status = localFilters.status;
    if (localFilters.type) advancedFilters.type = localFilters.type;
    if (localFilters.priority) advancedFilters.priority = localFilters.priority;
    if (localFilters.clientId) advancedFilters.clientId = localFilters.clientId;
    if (localFilters.projectManagerId) advancedFilters.projectManagerId = localFilters.projectManagerId;
    if (localFilters.startDate) advancedFilters.startDate = localFilters.startDate;
    if (localFilters.endDate) advancedFilters.endDate = localFilters.endDate;
    
    onFilterChange(advancedFilters);
  };

  const handleReset = () => {
    setSearchTerm('');
    setLocalFilters({
      status: '',
      type: '',
      priority: '',
      clientId: '',
      projectManagerId: '',
      startDate: '',
      endDate: ''
    });
    setIsAdvancedOpen(false);
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 1 && value !== 10 && value !== 'createdAt' && value !== 'DESC'
  );

  const projectManagers = users.filter(user => user.role === 'admin' || user.role === 'manager');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search projects by name, number, description, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          Search
        </Button>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="text-sm font-medium text-gray-700 self-center">Quick filters:</div>
        
        {/* Status Filters */}
        <Button
          variant={filters.status === 'in_progress' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleQuickFilter('status', filters.status === 'in_progress' ? undefined : 'in_progress')}
        >
          🚧 In Progress
        </Button>
        
        <Button
          variant={filters.status === 'planning' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleQuickFilter('status', filters.status === 'planning' ? undefined : 'planning')}
        >
          📋 Planning
        </Button>
        
        <Button
          variant={filters.status === 'completed' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleQuickFilter('status', filters.status === 'completed' ? undefined : 'completed')}
        >
          ✅ Completed
        </Button>
        
        <Button
          variant={filters.status === 'on_hold' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleQuickFilter('status', filters.status === 'on_hold' ? undefined : 'on_hold')}
        >
          ⏸️ On Hold
        </Button>

        {/* Priority Filters */}
        <Button
          variant={filters.priority === 'urgent' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleQuickFilter('priority', filters.priority === 'urgent' ? undefined : 'urgent')}
        >
          🔴 Urgent
        </Button>
        
        <Button
          variant={filters.priority === 'high' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleQuickFilter('priority', filters.priority === 'high' ? undefined : 'high')}
        >
          🟠 High Priority
        </Button>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          {isAdvancedOpen ? '▼' : '▶'} Advanced Filters
        </Button>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filters applied</span>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleLocalFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={localFilters.type}
                onChange={(e) => handleLocalFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="residential">🏠 Residential</option>
                <option value="commercial">🏢 Commercial</option>
                <option value="industrial">🏭 Industrial</option>
                <option value="infrastructure">🌉 Infrastructure</option>
                <option value="renovation">🔨 Renovation</option>
                <option value="maintenance">🔧 Maintenance</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={localFilters.priority}
                onChange={(e) => handleLocalFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            {/* Client Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <select
                value={localFilters.clientId}
                onChange={(e) => handleLocalFilterChange('clientId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Manager Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Manager
              </label>
              <select
                value={localFilters.projectManagerId}
                onChange={(e) => handleLocalFilterChange('projectManagerId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Managers</option>
                {projectManagers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date From
              </label>
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) => handleLocalFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-start-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date To
              </label>
              <input
                type="date"
                value={localFilters.endDate}
                onChange={(e) => handleLocalFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Advanced Filter Actions */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setLocalFilters({
                  status: '',
                  type: '',
                  priority: '',
                  clientId: '',
                  projectManagerId: '',
                  startDate: '',
                  endDate: ''
                });
              }}
            >
              Clear Advanced
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={applyAdvancedFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm font-medium text-gray-700 self-center">Active filters:</span>
          
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange({ search: undefined })}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Status: {filters.status.replace('_', ' ')}
              <button
                onClick={() => onFilterChange({ status: undefined })}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Type: {filters.type}
              <button
                onClick={() => onFilterChange({ type: undefined })}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.priority && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Priority: {filters.priority}
              <button
                onClick={() => onFilterChange({ priority: undefined })}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.clientId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Client: {clients.find(c => c.id.toString() === filters.clientId)?.companyName || `ID ${filters.clientId}`}
              <button
                onClick={() => onFilterChange({ clientId: undefined })}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.projectManagerId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
              Manager: {projectManagers.find(u => u.id.toString() === filters.projectManagerId)?.firstName || `ID ${filters.projectManagerId}`}
              <button
                onClick={() => onFilterChange({ projectManagerId: undefined })}
                className="ml-1 text-pink-600 hover:text-pink-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;