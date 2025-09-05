import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Project, Client, User, ProjectStats } from "../../types";
import {
  projectService,
  ProjectListParams,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../services/projectService";
import { clientService } from "../../services/clientService";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import ProjectTable from "../../components/projects/ProjectTable";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectFilters from "../../components/projects/ProjectFilters";
import ProjectStatsComponent from "../../components/projects/ProjectStats";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";

type ViewMode = "table" | "cards";

const ProjectManagement = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string>("");

  // Pagination and filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10,
  });

  const [filters, setFilters] = useState<ProjectListParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  // UI states
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadProjects();
    loadStats();
    loadSupportingData();
  }, [filters, loadProjects, loadStats, loadSupportingData]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects(filters);
      setProjects(response.projects);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");
      const projectStats = await projectService.getProjectStats();
      setStats(projectStats);
    } catch (error: any) {
      setStatsError(
        error.response?.data?.message || "Failed to load statistics"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  const loadSupportingData = async () => {
    try {
      // Load clients for the project form
      const clientsResponse = await clientService.getClients({});
      setClients(clientsResponse.clients || []);
      
      // Load users for the project form
      const usersResponse = await userService.getUsers({});
      // Ensure usersResponse and usersResponse.users exist before mapping
      const usersArray = usersResponse?.users || [];
      // Convert UserServiceUser[] to User[] by mapping the properties
      const convertedUsers: User[] = usersArray.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as 'admin' | 'manager' | 'employee',
        phone: user.phone,
        address: user.address,
        profilePicture: undefined,
        isActive: user.status === 'active',
        isEmailVerified: true, // Default value
        lastLoginAt: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      setUsers(convertedUsers);
    } catch (error: any) {
      console.error("Failed to load supporting data:", error);
      toast.error("Failed to load supporting data");
      // Set default empty arrays on error
      setClients([]);
      setUsers([]);
    }
  };

  // Filter and search handlers
  const handleFilterChange = (newFilters: Partial<ProjectListParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (field: string) => {
    const newSortOrder =
      filters.sortBy === field && filters.sortOrder === "ASC" ? "DESC" : "ASC";
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
  };

  // CRUD operations
  const handleCreateProject = async (
    projectData: CreateProjectRequest | UpdateProjectRequest
  ) => {
    try {
      setFormLoading(true);
      // We know this is a CreateProjectRequest when called from the create form
      await projectService.createProject(projectData as CreateProjectRequest);
      toast.success("Project created successfully");
      setShowCreateModal(false);
      loadProjects();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create project");
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = async (projectData: UpdateProjectRequest) => {
    if (!selectedProject) return;

    try {
      setFormLoading(true);
      await projectService.updateProject(selectedProject.id, projectData);
      toast.success("Project updated successfully");
      setShowEditModal(false);
      setSelectedProject(null);
      loadProjects();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update project");
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (project: Project, status: string) => {
    try {
      await projectService.updateProjectStatus(project.id, status);
      toast.success("Project status updated successfully");
      loadProjects();
      loadStats();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update project status"
      );
    }
  };

  const handleUpdateProgress = async (project: Project, progress: number) => {
    try {
      await projectService.updateProjectProgress(project.id, progress);
      toast.success("Project progress updated successfully");
      loadProjects();
      loadStats();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update project progress"
      );
    }
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await projectService.deleteProject(selectedProject.id);
      toast.success("Project deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedProject(null);
      loadProjects();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const handleViewProject = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Project Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your construction projects
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📋 Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🗂️ Cards
            </button>
          </div>

          {/* Create Project Button */}
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            ➕ New Project
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <ProjectStatsComponent
        stats={stats}
        loading={statsLoading}
        error={statsError}
      />

      {/* Filters */}
      <ProjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        clients={clients}
        users={users}
        loading={loading}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {pagination.totalProjects > 0 ? (
            <>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalProjects
              )}{" "}
              of {pagination.totalProjects} projects
            </>
          ) : (
            "No projects found"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>Per page:</span>
          <select
            value={filters.limit}
            onChange={(e) =>
              handleFilterChange({ limit: parseInt(e.target.value), page: 1 })
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Project List */}
      {viewMode === "table" ? (
        <ProjectTable
          projects={projects}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleEditProject}
          onView={handleViewProject}
          onUpdateStatus={handleUpdateStatus}
          onUpdateProgress={handleUpdateProgress}
          onDelete={handleDeleteProject}
          currentUserId={currentUser?.id}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
        />
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={handleViewProject}
                    onEdit={handleEditProject}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>

              {/* Pagination for cards view */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No projects found
              </div>
              <div className="text-gray-400 text-sm mb-6">
                {Object.keys(filters).some(
                  (key) =>
                    filters[key as keyof ProjectListParams] &&
                    key !== "page" &&
                    key !== "limit" &&
                    key !== "sortBy" &&
                    key !== "sortOrder"
                )
                  ? "Try adjusting your search filters"
                  : "Get started by creating your first project"}
              </div>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                ➕ Create First Project
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="xl"
      >
        <div className="max-h-[90vh] overflow-y-auto">
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setShowCreateModal(false)}
            clients={clients}
            users={users}
            loading={formLoading}
          />
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
        size="xl"
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <ProjectForm
              project={selectedProject}
              isEdit
              onSubmit={handleUpdateProject}
              onCancel={() => setShowEditModal(false)}
              clients={clients}
              users={users}
              loading={formLoading}
            />
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonClass="btn-danger"
      />
    </div>
  );
};

export default ProjectManagement;
