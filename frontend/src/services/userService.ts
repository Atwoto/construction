import { apiClient } from './authService';
import { UserSummary } from '../types/client';

// Define a separate interface for the user service response
export interface UserServiceUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive' | 'deleted';
  phone?: string;
  address?: any;
  dateOfBirth?: string;
  emergencyContact?: any;
  profile?: any;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  employeeProfile?: any;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  phone?: string;
  address?: any;
  dateOfBirth?: string;
  emergencyContact?: any;
  profile?: any;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'employee';
  phone?: string;
  address?: any;
  dateOfBirth?: string;
  emergencyContact?: any;
  profile?: any;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UserListResponse {
  users: UserServiceUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  recentUsers: UserServiceUser[];
}

class UserService {
  // Get all users with pagination and filtering
  async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/users?${queryParams.toString()}`);
      // Ensure we return a proper response structure even if API response is malformed
      const data = response.data;
      return {
        users: Array.isArray(data?.data?.users) ? data.data.users : 
               Array.isArray(data?.users) ? data.users : 
               Array.isArray(data?.data) ? data.data : 
               [],
        pagination: data?.data?.pagination || data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return a default response structure on error
      return {
        users: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<UserServiceUser> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }
  
  // Get users summary for dropdowns and assignments
  async getUsersSummary(): Promise<UserSummary[]> {
    try {
      console.log('👥 Fetching user summary from API');
      const response = await apiClient.get('/users/summary');
      console.log('✅ User summary response:', response.data);
      // Ensure we're returning an array
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('❌ Error fetching user summary:', error);
      // Return empty array on error
      return [];
    }
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<UserServiceUser> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  }

  // Update user
  async updateUser(id: number, userData: UpdateUserRequest): Promise<UserServiceUser> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  // Change password
  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put(`/users/${id}/password`, {
      currentPassword,
      newPassword
    });
  }

  // Toggle user status
  async toggleUserStatus(id: number): Promise<{ status: string }> {
    const response = await apiClient.patch(`/users/${id}/toggle-status`);
    return response.data;
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiClient.get('/users/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Return default stats object on error
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        usersByRole: [],
        recentUsers: []
      };
    }
  }

  // Helper methods
  getUserFullName(user: UserServiceUser): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  getUserDisplayRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrator',
      manager: 'Manager',
      employee: 'Employee'
    };
    return roleMap[role] || role;
  }

  getUserStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-yellow-600 bg-yellow-100',
      deleted: 'text-red-600 bg-red-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  }

  getRoleColor(role: string): string {
    const roleColors: { [key: string]: string } = {
      admin: 'text-purple-600 bg-purple-100',
      manager: 'text-blue-600 bg-blue-100',
      employee: 'text-gray-600 bg-gray-100'
    };
    return roleColors[role] || 'text-gray-600 bg-gray-100';
  }

  formatLastLogin(lastLogin: string | null): string {
    if (!lastLogin) return 'Never';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export const userService = new UserService();