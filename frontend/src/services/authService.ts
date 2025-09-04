import axios, { AxiosResponse } from 'axios';
import { User, AuthTokens, LoginCredentials, RegisterData, ApiResponse } from '../types';

// API base configuration - Make sure this matches your backend port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'construction_crm_access_token';
const REFRESH_TOKEN_KEY = 'construction_crm_refresh_token';

// Auth service class
class AuthService {
  // Store tokens in localStorage
  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    this.setAuthHeader(tokens.accessToken);
  }

  // Get stored tokens
  getStoredTokens(): AuthTokens | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (accessToken && refreshToken) {
      this.setAuthHeader(accessToken);
      return {
        accessToken,
        refreshToken,
        expiresIn: '24h',
        tokenType: 'Bearer',
      };
    }

    return null;
  }

  // Clear stored tokens
  clearStoredTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }

  // Set authorization header
  private setAuthHeader(token: string): void {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string; refreshToken: string }>> = await api.post(
        '/auth/login',
        credentials
      );
      
      // Handle the response format from our backend
      if (response.data.data) {
        const { user, token, refreshToken } = response.data.data;
        return {
          user,
          tokens: {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: '24h',
            tokenType: 'Bearer',
          }
        };
      }
      
      // If response is directly the data (not wrapped in data object)
      if ((response.data as any).user && (response.data as any).token) {
        const { user, token, refreshToken } = response.data as any;
        return {
          user,
          tokens: {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: '24h',
            tokenType: 'Bearer',
          }
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  // Register user
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string; refreshToken: string }>> = await api.post(
        '/auth/register',
        data
      );
      
      // Handle the response format from our backend
      if (response.data.data) {
        const { user, token, refreshToken } = response.data.data;
        return {
          user,
          tokens: {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: '24h',
            tokenType: 'Bearer',
          }
        };
      }
      
      // If response is directly the data (not wrapped in data object)
      if ((response.data as any).user && (response.data as any).token) {
        const { user, token, refreshToken } = response.data as any;
        return {
          user,
          tokens: {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: '24h',
            tokenType: 'Bearer',
          }
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.get('/auth/profile');
    return response.data.data!.user;
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.put('/auth/profile', data);
    return response.data.data!.user;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    const response: AxiosResponse<ApiResponse<{ tokens: AuthTokens }>> = await api.post(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data!;
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email/${token}`);
  }

  // Resend email verification
  async resendEmailVerification(): Promise<void> {
    await api.post('/auth/resend-verification');
  }
}

// Create and export service instance
export const authService = new AuthService();

// Export api instance for other services
export const apiClient = api;

// Request interceptor to handle token refresh
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await authService.refreshToken(refreshToken);
          authService.storeTokens(response.tokens);
          originalRequest.headers.Authorization = `Bearer ${response.tokens.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        authService.clearStoredTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export the configured axios instance for use in other services
export { api };