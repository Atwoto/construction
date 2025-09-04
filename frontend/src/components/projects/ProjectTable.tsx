import React, { useState } from 'react';
import { Project } from '../../types';
import { projectService, ProjectListResponse } from '../../services/projectService';
import LoadingSpinner from '../common/LoadingSpinner';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  pagination: ProjectListResponse['pagination'];
  onPageChange: (page: number) => void;
  onEdit?: (project: Project) => void;
  onView?: (project: Project) => void;
  onUpdateStatus?: (project: Project, status: string) => void;
  onUpdateProgress?: (project: Project, progress: number) => void;
  onDelete?: (project: Project) => void;
  currentUserId?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (field: string) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onView,
  onUpdateStatus,
  onUpdateProgress,
  onDelete,
  currentUserId,
  sortBy,
  sortOrder,
  onSort
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [progressInputs, setProgressInputs] = useState<{ [key: number]: number }>({});

  const toggleRowExpansion = (projectId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedRows(newExpanded);
  };

  const handleProgressChange = (projectId: number, value: number) => {
    setProgressInputs(prev => ({ ...prev, [projectId]: value }));
  };

  const handleProgressSubmit = (project: Project) => {
    const newProgress = progressInputs[project.id];
    if (newProgress !== undefined && onUpdateProgress) {
      onUpdateProgress(project, newProgress);
      setProgressInputs(prev => {
        const updated = { ...prev };
        delete updated[project.id];
        return updated;
      });
    }
  };

  const handleStatusChange = (project: Project, status: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(project, status);
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'ASC' ? 
      <ChevronUpIcon className="w-4 h-4 text-blue-600" /> : 
      <ChevronDownIcon className="w-4 h-4 text-blue-600" />;
  };

  const renderPagination = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrev}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    );

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b ${
            i === currentPage
              ? 'bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNext}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pagination.limit, pagination.totalProjects)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{pagination.totalProjects}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {pages}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No projects found</div>
        <div className="text-gray-400 text-sm">Try adjusting your search filters</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Expand/Collapse */}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('projectNumber')}
              >
                <div className="flex items-center space-x-1">
                  <span>Project #</span>
                  {renderSortIcon('projectNumber')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('estimatedEndDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>End Date</span>
                  {renderSortIcon('estimatedEndDate')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => {
              const isExpanded = expandedRows.has(project.id);
              const daysRemaining = new Date(project.estimatedEndDate).getTime() - new Date().getTime();
              const isOverdue = daysRemaining < 0 && project.status !== 'completed';
              const daysRemainingCount = Math.ceil(daysRemaining / (1000 * 60 * 60 * 24));

              return (
                <React.Fragment key={project.id}>
                  <tr className={isOverdue ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(project.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronUpIcon className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {project.projectNumber}
                        </span>
                        {isOverdue && (
                          <span className="ml-2 text-red-500 text-xs">⚠️</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">
                          {projectService.getProjectTypeIcon(project.type)}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {project.name}
                          </div>
                          {project.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {project.client?.companyName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.client?.contactPerson || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${projectService.getProjectStatusColor(project.status)}`}
                        disabled={!onUpdateStatus}
                      >
                        <option value="planning">Planning</option>
                        <option value="approved">Approved</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={progressInputs[project.id] ?? project.progress}
                            onChange={(e) => handleProgressChange(project.id, parseInt(e.target.value))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleProgressSubmit(project);
                              }
                            }}
                            className="w-12 text-xs text-center border border-gray-300 rounded px-1 py-0.5"
                            disabled={!onUpdateProgress}
                          />
                          <span className="text-xs text-gray-500">%</span>
                          {progressInputs[project.id] !== undefined && progressInputs[project.id] !== project.progress && (
                            <button
                              onClick={() => handleProgressSubmit(project)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(project.estimatedEndDate).toLocaleDateString()}
                      </div>
                      {daysRemainingCount >= 0 ? (
                        <div className="text-xs text-gray-500">
                          {daysRemainingCount} days left
                        </div>
                      ) : (
                        <div className="text-xs text-red-500">
                          {Math.abs(daysRemainingCount)} days overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {projectService.formatCurrency(project.budget)}
                      </div>
                      {project.actualCost > 0 && (
                        <div className="text-xs text-gray-500">
                          Spent: {projectService.formatCurrency(project.actualCost)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(project)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            View
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(project)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(project)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Address:</span>
                            <div className="text-gray-600 mt-1">
                              {project.address}, {project.city}, {project.state} {project.zipCode}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Project Manager:</span>
                            <div className="text-gray-600 mt-1">
                              {project.projectManager ? 
                                `${project.projectManager.firstName} ${project.projectManager.lastName}` : 
                                'Not assigned'
                              }
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Priority:</span>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${projectService.getProjectPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Start Date:</span>
                            <div className="text-gray-600 mt-1">
                              {new Date(project.startDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Team Members:</span>
                            <div className="text-gray-600 mt-1">
                              {project.teamMembers?.length || 0} members
                            </div>
                          </div>
                          {project.notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">Notes:</span>
                              <div className="text-gray-600 mt-1">
                                {project.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default ProjectTable;