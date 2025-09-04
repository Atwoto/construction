import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { projectService } from "../../services/projectService";
import { Project } from "../../types";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import ProjectForm from "../../components/projects/ProjectForm";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadProjectDetails(parseInt(id));
    }
  }, [id]);

  const loadProjectDetails = async (projectId: number) => {
    try {
      setLoading(true);
      const projectData = await projectService.getProjectById(projectId);
      setProject(projectData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load project details");
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (projectData: Partial<Project>) => {
    if (!project) return;
    try {
      await projectService.updateProject(project.id, projectData);
      toast.success("Project updated successfully");
      setShowEditModal(false);
      loadProjectDetails(project.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update project");
      throw err;
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      await projectService.deleteProject(project.id);
      toast.success("Project deleted successfully");
      // Navigate back to project list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              Edit Project
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Project
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.client?.companyName}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Project Manager
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.projectManager?.firstName}{" "}
                {project.projectManager?.lastName}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.status}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {projectService.formatCurrency(project.budget)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(project.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="py-4 sm:py_5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Estimated End Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(project.estimatedEndDate).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={project}
          isEdit
          onSubmit={handleUpdateProject}
          onCancel={() => setShowEditModal(false)}
          clients={[]}
          users={[]}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete ${project.name}? This action cannot be undone.`}
        confirmButtonClass="btn-danger"
      />
    </div>
  );
};

export default ProjectDetailsPage;
