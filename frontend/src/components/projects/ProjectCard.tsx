import React from 'react';
import { Project } from '../../types';
import { projectService } from '../../services/projectService';
import Card from '../common/Card';
import Button from '../common/Button';

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onUpdateStatus?: (project: Project, status: string) => void;
  onDelete?: (project: Project) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onUpdateStatus,
  onDelete,
  className = '',
  showActions = true,
  compact = false
}) => {
  const isOverdue = projectService.isProjectOverdue(project);
  const daysRemaining = projectService.getProjectDaysRemaining(project);
  const projectHealth = projectService.calculateProjectHealth(project);
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (onUpdateStatus) {
      onUpdateStatus(project, e.target.value);
    }
  };

  const handleAction = (action: () => void, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    action();
  };

  return (
    <div 
      className={`cursor-pointer ${onView ? 'hover:scale-[1.02]' : ''} transition-transform duration-200`}
      onClick={() => onView?.(project)}
    >
      <Card 
        className={`transition-all duration-200 hover:shadow-lg ${isOverdue ? 'border-red-200 bg-red-50' : ''} ${className}`}
        hover
      >
      <Card.Content className={compact ? 'p-4' : 'p-6'}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {projectService.getProjectTypeIcon(project.type)}
              </span>
              {isOverdue && (
                <span className="text-red-500 text-lg">⚠️</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500">
                {projectService.formatProjectNumber(project.projectNumber)}
              </p>
            </div>
          </div>
          
          {!compact && (
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${projectService.getProjectPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
              <span className={`w-3 h-3 rounded-full ${projectService.getProjectHealthColor(projectHealth)}`} title={`Project health: ${projectHealth}`}></span>
            </div>
          )}
        </div>

        {/* Description */}
        {!compact && project.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Key Information */}
        <div className="space-y-3 mb-4">
          {/* Client */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Client:</span>
            <span className="font-medium text-gray-900 truncate ml-2">
              {project.client?.companyName || 'Not assigned'}
            </span>
          </div>

          {/* Project Manager */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Manager:</span>
            <span className="font-medium text-gray-900 truncate ml-2">
              {project.projectManager ? 
                `${project.projectManager.firstName} ${project.projectManager.lastName}` : 
                'Not assigned'
              }
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            {onUpdateStatus ? (
              <select
                value={project.status}
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
                className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${projectService.getProjectStatusColor(project.status)}`}
              >
                <option value="planning">Planning</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${projectService.getProjectStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Timeline:</span>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {new Date(project.estimatedEndDate).toLocaleDateString()}
              </div>
              {daysRemaining >= 0 ? (
                <div className="text-xs text-gray-500">
                  {daysRemaining} days left
                </div>
              ) : (
                <div className="text-xs text-red-500">
                  {Math.abs(daysRemaining)} days overdue
                </div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Budget:</span>
            <span className="font-medium text-gray-900">
              {projectService.formatCurrency(project.budget)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Progress:</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                project.progress === 100 ? 'bg-green-600' :
                project.progress >= 75 ? 'bg-blue-600' :
                project.progress >= 50 ? 'bg-yellow-600' :
                project.progress >= 25 ? 'bg-orange-600' :
                'bg-red-600'
              }`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Additional Info (non-compact) */}
        {!compact && (
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-4 pt-4 border-t">
            <div>
              <span className="block">Type:</span>
              <span className="font-medium text-gray-700 capitalize">
                {project.type.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="block">Team:</span>
              <span className="font-medium text-gray-700">
                {project.teamMembers?.length || 0} members
              </span>
            </div>
            <div>
              <span className="block">Location:</span>
              <span className="font-medium text-gray-700 truncate">
                {project.city}, {project.state}
              </span>
            </div>
            <div>
              <span className="block">Health:</span>
              <span className={`font-medium capitalize ${projectService.getProjectHealthColor(projectHealth)}`}>
                {projectHealth}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {!compact && project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            {onView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => handleAction(() => onView(project), e)}
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => handleAction(() => onEdit(project), e)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => handleAction(() => onDelete(project), e)}
              >
                Delete
              </Button>
            )}
          </div>
        )}

        {/* Compact mode actions */}
        {compact && showActions && (
          <div className="flex items-center justify-center mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => handleAction(() => onView?.(project), e)}
              className="w-full"
            >
              View Details
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
    </div>
  );
};

export default ProjectCard;