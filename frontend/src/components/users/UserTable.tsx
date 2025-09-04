import React from 'react';
import { UserServiceUser as User } from '../../services/userService';
import { userService } from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';

interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number) => void;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onDelete?: (user: User) => void;
  currentUserId?: number;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onToggleStatus,
  onDelete,
  currentUserId
}) => {
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
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? 'bg-primary-600 text-white border-primary-600'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
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

    return pages;
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <div className="text-sm text-gray-500">
            Showing {users.length} of {pagination.totalUsers} users
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {userService.getUserFullName(user)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${userService.getRoleColor(user.role)}`}>
                    {userService.getUserDisplayRole(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${userService.getUserStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {userService.formatLastLogin(user.lastLogin || null)}
                </td>
                <td className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        title="Edit user"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    
                    {onToggleStatus && user.id !== currentUserId && (
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`text-sm font-medium ${
                          user.status === 'active'
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.status === 'active' ? '🔒 Deactivate' : '🔓 Activate'}
                      </button>
                    )}
                    
                    {onDelete && user.id !== currentUserId && (
                      <button
                        onClick={() => onDelete(user)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        title="Delete user"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">👤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="card-footer">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex">{renderPagination()}</div>
          </div>
        </div>
      )}

      {loading && users.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
};

export default UserTable;