import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { User, AuthTokens } from "../types";

// Mock authentication flag - set to true to enable mock auth
const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH === "true";
console.log("USE_MOCK_AUTH:", USE_MOCK_AUTH);

// Mock user data for testing
const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  role: "admin" as const,
  phone: "+1234567890",
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TOKENS = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiresIn: "24h",
  tokenType: "Bearer",
};
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "admin" | "manager" | "employee";
  phone?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Auth actions
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; tokens: AuthTokens } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "CLEAR_ERROR" };

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      // For development, auto-login with admin credentials
      if (process.env.NODE_ENV === "development") {
        try {
          console.log(
            "🔐 Auto-logging in with admin credentials for development..."
          );
          await login({
            email: "admin@constructioncrm.com",
            password: "Admin123!",
          });
          return;
        } catch (error) {
          console.error("❌ Auto-login failed:", error);
        }
      }

      try {
        const tokens = authService.getStoredTokens();
        if (tokens) {
          dispatch({ type: "AUTH_START" });
          const user = await authService.getCurrentUser();
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user, tokens },
          });
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        authService.clearStoredTokens();
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    initAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!state.tokens || USE_MOCK_AUTH) return;

    const refreshInterval = setInterval(
      async () => {
        try {
          await refreshToken();
        } catch (error) {
          console.error("Token refresh failed:", error);
          logout();
        }
      },
      15 * 60 * 1000
    ); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [state.tokens, refreshToken]);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    console.log("🔐 Login function called with:", credentials.email);

    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.login(credentials);

      authService.storeTokens(response.tokens);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.user, tokens: response.tokens },
      });

      toast.success("Login successful!");
      console.log("✅ Login successful for:", response.user.email);
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    // Use mock auth if enabled
    if (USE_MOCK_AUTH) {
      console.log("Mock registration with data:", data);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: MOCK_USER, tokens: MOCK_TOKENS },
      });
      toast.success("Mock registration successful!");
      return;
    }

    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.register(data);

      authService.storeTokens(response.tokens);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.user, tokens: response.tokens },
      });

      toast.success("Registration successful!");
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    // Use mock auth if enabled
    if (USE_MOCK_AUTH) {
      console.log("Mock logout");
      dispatch({ type: "AUTH_LOGOUT" });
      toast.success("Mock logged out successfully");
      return;
    }

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      authService.clearStoredTokens();
      dispatch({ type: "AUTH_LOGOUT" });
      toast.success("Logged out successfully");
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    // Use mock auth if enabled
    if (USE_MOCK_AUTH) {
      console.log("Mock profile update with data:", data);
      const updatedUser = { ...state.user, ...data } as User;
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      toast.success("Mock profile updated successfully!");
      return;
    }

    try {
      const updatedUser = await authService.updateProfile(data);
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Profile update failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Change password function
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    // Use mock auth if enabled
    if (USE_MOCK_AUTH) {
      console.log("Mock password change");
      toast.success("Mock password changed successfully!");
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Password change failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    // Use mock auth if enabled
    if (USE_MOCK_AUTH) {
      console.log("Mock token refresh");
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: MOCK_USER, tokens: MOCK_TOKENS },
      });
      return;
    }

    try {
      if (!state.tokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken(
        state.tokens.refreshToken
      );
      authService.storeTokens(response.tokens);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: state.user!, tokens: response.tokens },
      });
    } catch (error) {
      authService.clearStoredTokens();
      dispatch({ type: "AUTH_LOGOUT" });
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="btn btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export { AuthContext };
