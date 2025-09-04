import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { User } from "../../types";
import {
  userService,
  UserServiceUser,
  UserListParams,
  UserStats,
} from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import UserFilters from "../../components/users/UserFilters";
import UserStatsComponent from "../../components/users/UserStats";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserServiceUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string>("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserServiceUser | null>(null);

  // Convert UserServiceUser to User type
  const convertUserServiceUserToUser = (userServiceUser: UserServiceUser): User => {
    return {
      id: userServiceUser.id,
      email: userServiceUser.email,
      firstName: userServiceUser.firstName,
      lastName: userServiceUser.lastName,
      role: userServiceUser.role,
      phone: userServiceUser.phone,
      isActive: userServiceUser.status === "active",
      isEmailVerified: true, // Default value since it's not in UserServiceUser
      createdAt: userServiceUser.createdAt,
      updatedAt: userServiceUser.updatedAt,
    };
  };

  // Filter and search states
  const [filters, setFilters] = useState<UserListParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  // Load initial data
  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(filters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");
      const userStats = await userService.getUserStats();
      setStats(userStats);
    } catch (error: any) {
      setStatsError(
        error.response?.data?.message || "Failed to load statistics"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<UserListParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle create user
  const handleCreateUser = async (userData: any) => {
    try {
      await userService.createUser(userData);
      toast.success("User created successfully");
      setShowCreateModal(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
      throw error;
    }
  };

  // Handle edit user
  const handleEditUser = (user: UserServiceUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;

    try {
      await userService.updateUser(selectedUser.id, userData);
      toast.success("User updated successfully");
      setShowEditModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
      throw error;
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (user: UserServiceUser) => {
    try {
      await userService.toggleUserStatus(user.id);
      const action = user.status === "active" ? "deactivated" : "activated";
      toast.success(`User ${action} successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  // Handle delete user
  const handleDeleteUser = (user: UserServiceUser) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await userService.deleteUser(selectedUser.id);
      toast.success("User deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Check permissions
  const canCreateUsers = currentUser?.role === "admin";
  const canEditUsers =
    currentUser?.role === "admin" || currentUser?.role === "manager";
  const canDeleteUsers = currentUser?.role === "admin";

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>
        {canCreateUsers && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            ➕ Add User
          </button>
        )}
      </div>

      {/* Stats */}
      <UserStatsComponent
        stats={stats}
        loading={statsLoading}
        error={statsError}
      />

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() =>
          setFilters({
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "DESC",
          })
        }
      />

      {/* User Table */}
      <UserTable
        users={users}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={canEditUsers ? handleEditUser : undefined}
        onToggleStatus={canEditUsers ? handleToggleStatus : undefined}
        onDelete={canDeleteUsers ? handleDeleteUser : undefined}
        currentUserId={currentUser?.id}
      />

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="lg"
      >
        <UserForm
          user={selectedUser ? convertUserServiceUserToUser(selectedUser) : undefined}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonClass="btn-danger"
      />
    </div>
  );
};

export default UserManagement;
