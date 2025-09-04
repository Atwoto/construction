import React, { useState } from 'react';
import { UserListParams } from '../../services/userService';

interface UserFiltersProps {
  filters: UserListParams;
  onFilterChange: (filters: Partial<UserListParams>) => void;
  onReset: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm || undefined });
  };

  const handleQuickFilter = (key: keyof UserListParams, value: any) => {
    onFilterChange({ [key]: value });
  };

  const handleReset = () => {
    setSearchTerm('');
    setIsAdvancedOpen(false);
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 1 && value !== 10 && value !== 'createdAt' && value !== 'DESC'
  );

  return (
    <div className="card">
      <div className="card-content">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, email, or username..."
              className="form-input pl-10"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                onFilterChange({ search: undefined });
              }}
              className="btn btn-outline"
            >
              Clear
            </button>
          )}
        </form>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
          
          {/* Role Filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuickFilter('role', undefined)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                !filters.role 
                  ? 'bg-primary-100 text-primary-700 border-primary-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => handleQuickFilter('role', 'admin')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700 border-purple-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickFilter('role', 'manager')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.role === 'manager' 
                  ? 'bg-blue-100 text-blue-700 border-blue-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => handleQuickFilter('role', 'employee')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.role === 'employee' 
                  ? 'bg-gray-100 text-gray-700 border-gray-400' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Employee
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuickFilter('status', undefined)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                !filters.status 
                  ? 'bg-primary-100 text-primary-700 border-primary-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => handleQuickFilter('status', 'active')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.status === 'active' 
                  ? 'bg-green-100 text-green-700 border-green-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleQuickFilter('status', 'inactive')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.status === 'inactive' 
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isAdvancedOpen ? '📤 Hide Advanced' : '📥 Advanced Filters'}
          </button>

          {hasActiveFilters && (
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                {Object.keys(filters).filter(key => 
                  filters[key as keyof UserListParams] !== undefined && 
                  filters[key as keyof UserListParams] !== '' &&
                  key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder'
                ).length} filters active
              </span>
              <button
                onClick={handleReset}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                🗑️ Reset All
              </button>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'createdAt'}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                  className="form-select"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="firstName">First Name</option>
                  <option value="lastName">Last Name</option>
                  <option value="email">Email</option>
                  <option value="lastLogin">Last Login</option>
                  <option value="role">Role</option>
                  <option value="status">Status</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <select
                  value={filters.sortOrder || 'DESC'}
                  onChange={(e) => onFilterChange({ sortOrder: e.target.value as 'ASC' | 'DESC' })}
                  className="form-select"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Items Per Page
                </label>
                <select
                  value={filters.limit || 10}
                  onChange={(e) => onFilterChange({ limit: parseInt(e.target.value), page: 1 })}
                  className="form-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFilters;