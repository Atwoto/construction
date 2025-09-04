import React, { useState, useEffect } from 'react';
import { Project, User } from '../../types';
import { Client } from '../../types/client';
import { CreateProjectRequest, UpdateProjectRequest, projectService } from '../../services/projectService';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  onCancel: () => void;
  clients: Client[];
  users: User[];
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  isEdit = false,
  onSubmit,
  onCancel,
  clients,
  users,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'residential' as 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation' | 'maintenance',
    status: 'planning' as 'planning' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    startDate: '',
    estimatedEndDate: '',
    actualEndDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    budget: '',
    actualCost: '',
    estimatedRevenue: '',
    actualRevenue: '',
    progress: 0,
    clientId: '',
    projectManagerId: '',
    contractorId: '',
    notes: '',
    tags: '',
    weatherDependency: false,
    riskLevel: 'low' as 'low' | 'medium' | 'high' | 'critical',
    qualityScore: '',
    clientSatisfaction: '',
    teamMembers: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with project data if editing
  useEffect(() => {
    if (isEdit && project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || 'residential',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        estimatedEndDate: project.estimatedEndDate ? new Date(project.estimatedEndDate).toISOString().split('T')[0] : '',
        actualEndDate: project.actualEndDate ? new Date(project.actualEndDate).toISOString().split('T')[0] : '',
        address: project.address || '',
        city: project.city || '',
        state: project.state || '',
        zipCode: project.zipCode || '',
        budget: project.budget?.toString() || '',
        actualCost: project.actualCost?.toString() || '',
        estimatedRevenue: project.estimatedRevenue?.toString() || '',
        actualRevenue: project.actualRevenue?.toString() || '',
        progress: project.progress || 0,
        clientId: project.clientId?.toString() || '',
        projectManagerId: project.projectManagerId?.toString() || '',
        contractorId: project.contractorId?.toString() || '',
        notes: project.notes || '',
        tags: project.tags?.join(', ') || '',
        weatherDependency: project.weatherDependency || false,
        riskLevel: project.riskLevel || 'low',
        qualityScore: project.qualityScore?.toString() || '',
        clientSatisfaction: project.clientSatisfaction?.toString() || '',
        teamMembers: Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : ''
      });
    }
  }, [isEdit, project]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!formData.name.trim()) {
      validationErrors.push('Project name is required');
    }

    if (!formData.startDate) {
      validationErrors.push('Start date is required');
    }

    if (!formData.estimatedEndDate) {
      validationErrors.push('Estimated end date is required');
    }

    if (formData.startDate && formData.estimatedEndDate) {
      if (!projectService.validateProjectDates(formData.startDate, formData.estimatedEndDate)) {
        validationErrors.push('Start date must be before estimated end date');
      }
    }

    if (!formData.address.trim()) {
      validationErrors.push('Address is required');
    }

    if (!formData.city.trim()) {
      validationErrors.push('City is required');
    }

    if (!formData.state.trim()) {
      validationErrors.push('State is required');
    }

    if (!formData.zipCode.trim()) {
      validationErrors.push('Zip code is required');
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      validationErrors.push('Budget must be greater than 0');
    }

    if (!formData.clientId) {
      validationErrors.push('Please select a client');
    }

    if (!formData.projectManagerId) {
      validationErrors.push('Please select a project manager');
    }

    // ... other validations ...

    if (formData.actualCost && formData.actualCost !== '' && parseFloat(formData.actualCost) < 0) {
      validationErrors.push('Actual cost must be greater than or equal to 0');
    }

    if (formData.estimatedRevenue && formData.estimatedRevenue !== '' && parseFloat(formData.estimatedRevenue) < 0) {
      validationErrors.push('Estimated revenue must be greater than or equal to 0');
    }

    if (formData.actualRevenue && formData.actualRevenue !== '' && parseFloat(formData.actualRevenue) < 0) {
      validationErrors.push('Actual revenue must be greater than or equal to 0');
    }

    if (formData.qualityScore && formData.qualityScore !== '' && (parseFloat(formData.qualityScore) < 1 || parseFloat(formData.qualityScore) > 10)) {
      validationErrors.push('Quality score must be between 1 and 10');
    }

    if (formData.clientSatisfaction && formData.clientSatisfaction !== '' && (parseFloat(formData.clientSatisfaction) < 1 || parseFloat(formData.clientSatisfaction) > 5)) {
      validationErrors.push('Client satisfaction must be between 1 and 5');
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const submitData: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        startDate: formData.startDate,
        estimatedEndDate: formData.estimatedEndDate,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        budget: parseFloat(formData.budget) || 0,
        clientId: parseInt(formData.clientId),
        projectManagerId: parseInt(formData.projectManagerId),
        notes: formData.notes.trim() || undefined,
        weatherDependency: formData.weatherDependency,
        riskLevel: formData.riskLevel
      };

      // Add optional fields
      if (formData.actualEndDate) {
        submitData.actualEndDate = formData.actualEndDate;
      }
      
      if (formData.actualCost && formData.actualCost !== '') {
        submitData.actualCost = parseFloat(formData.actualCost) || 0;
      }
      
      if (formData.estimatedRevenue && formData.estimatedRevenue !== '') {
        submitData.estimatedRevenue = parseFloat(formData.estimatedRevenue) || 0;
      }
      
      if (formData.actualRevenue && formData.actualRevenue !== '') {
        submitData.actualRevenue = parseFloat(formData.actualRevenue) || 0;
      }
      
      if (formData.contractorId && formData.contractorId !== '') {
        submitData.contractorId = parseInt(formData.contractorId) || 0;
      }
      
      if (formData.qualityScore && formData.qualityScore !== '') {
        submitData.qualityScore = parseInt(formData.qualityScore) || 0;
      }
      
      if (formData.clientSatisfaction && formData.clientSatisfaction !== '') {
        submitData.clientSatisfaction = parseInt(formData.clientSatisfaction) || 0;
      }

      // Handle progress for edit mode
      if (isEdit) {
        submitData.progress = formData.progress;
      }

      // Parse tags
      if (formData.tags.trim()) {
        submitData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }

      // Parse team members
      if (formData.teamMembers && formData.teamMembers.trim()) {
        const teamMemberIds = formData.teamMembers.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        // Validate that all team member IDs are positive numbers
        if (teamMemberIds.some(id => id <= 0)) {
          validationErrors.push('All team member IDs must be positive numbers');
        }
        submitData.teamMembers = teamMemberIds;
      }

      await onSubmit(submitData);
    } catch (error: any) {
      if (error.response?.data?.details) {
        setErrors(error.response.data.details.map((detail: any) => detail.message));
      } else {
        setErrors([error.response?.data?.error || 'An error occurred while saving the project']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectManagers = users.filter(user => user.role === 'admin' || user.role === 'manager');
  const contractors = users.filter(user => user.role === 'employee' || user.role === 'manager');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 form-container">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm font-medium mb-2">Please fix the following errors:</div>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Information */}
      <div className="form-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="form-grid">
          <div className="form-grid-full">
            <Input
              label="Project Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="Enter project name"
            />
          </div>
          <div className="form-grid-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Project description (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="renovation">Renovation</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="planning">Planning</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Level
            </label>
            <select
              value={formData.riskLevel}
              onChange={(e) => handleInputChange('riskLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="form-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h3>
        <div className="form-grid">
          <div>
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Estimated End Date"
              type="date"
              value={formData.estimatedEndDate}
              onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
              required
            />
          </div>
          {isEdit && (
            <div>
              <Input
                label="Actual End Date"
                type="date"
                value={formData.actualEndDate}
                onChange={(e) => handleInputChange('actualEndDate', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="form-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Location</h3>
        <div className="form-grid">
          <div className="form-grid-full">
            <Input
              label="Address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              placeholder="Enter project address"
            />
          </div>
          <div>
            <Input
              label="City"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
              placeholder="Enter city"
            />
          </div>
          <div>
            <Input
              label="State"
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
              placeholder="Enter state"
            />
          </div>
          <div>
            <Input
              label="Zip Code"
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              required
              placeholder="Enter zip code"
            />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="form-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
        <div className="form-grid">
          <div>
            <Input
              label="Budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              required
              placeholder="Enter project budget"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Input
              label="Estimated Revenue"
              type="number"
              value={formData.estimatedRevenue}
              onChange={(e) => handleInputChange('estimatedRevenue', e.target.value)}
              placeholder="Enter estimated revenue"
              min="0"
              step="0.01"
            />
          </div>
          {isEdit && (
            <>
              <div>
                <Input
                  label="Actual Cost"
                  type="number"
                  value={formData.actualCost}
                  onChange={(e) => handleInputChange('actualCost', e.target.value)}
                  placeholder="Enter actual cost"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Input
                  label="Actual Revenue"
                  type="number"
                  value={formData.actualRevenue}
                  onChange={(e) => handleInputChange('actualRevenue', e.target.value)}
                  placeholder="Enter actual revenue"
                  min="0"
                  step="0.01"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Team Assignment */}
      <div className="form-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Team Assignment</h3>
        <div className="form-grid">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.companyName} - {client.contactPerson}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Manager
            </label>
            <select
              value={formData.projectManagerId}
              onChange={(e) => handleInputChange('projectManagerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a project manager</option>
              {projectManagers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contractor
            </label>
            <select
              value={formData.contractorId}
              onChange={(e) => handleInputChange('contractorId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a contractor (optional)</option>
              {contractors.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          {isEdit && (
            <div>
              <Input
                label="Progress (%)"
                type="number"
                value={formData.progress.toString()}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                placeholder="Enter progress percentage"
              />
            </div>
          )}
          <div className="form-grid-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members (optional)
            </label>
            <Input
              type="text"
              value={formData.teamMembers}
              onChange={(e) => handleInputChange('teamMembers', e.target.value)}
              placeholder="Enter team member IDs separated by commas (e.g., 1, 2, 3)"
            />
            {users.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Available team members: {users.filter(u => u.role === 'employee').map(u => `${u.firstName} ${u.lastName} (ID: ${u.id})`).join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="form-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        <div className="form-grid">
          <div className="form-grid-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional project notes (optional)"
            />
          </div>
          <div>
            <Input
              label="Tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.weatherDependency}
                onChange={(e) => handleInputChange('weatherDependency', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Weather Dependent</span>
            </label>
          </div>
          {isEdit && (
            <>
              <div>
                <Input
                  label="Quality Score (1-10)"
                  type="number"
                  value={formData.qualityScore}
                  onChange={(e) => handleInputChange('qualityScore', e.target.value)}
                  min="1"
                  max="10"
                  placeholder="Enter quality score"
                />
              </div>
              <div>
                <Input
                  label="Client Satisfaction (1-5)"
                  type="number"
                  value={formData.clientSatisfaction}
                  onChange={(e) => handleInputChange('clientSatisfaction', e.target.value)}
                  min="1"
                  max="5"
                  placeholder="Enter satisfaction rating"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEdit ? 'Update Project' : 'Create Project'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;