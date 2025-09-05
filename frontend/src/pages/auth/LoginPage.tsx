import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated (or if auth is bypassed)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled by the AuthContext
      console.error("Login failed:", error);
    }
  };

  // Auto-login bypass for testing
  const handleBypassLogin = () => {
    // This will trigger the bypass in AuthContext
    login({ email: "bypass", password: "bypass" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-soft"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-secondary-200 rounded-full opacity-30 animate-pulse-soft"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary-100 rounded-full opacity-25 animate-ping-slow"></div>
        <div
          className="absolute bottom-32 right-10 w-12 h-12 bg-secondary-300 rounded-full opacity-20 animate-bounce-soft"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 shadow-colored-lg animate-scale-in">
            <span className="text-3xl text-white">🏗️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2 animate-slide-down">
            Construction CRM
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-slide-down stagger-1">
            Welcome back!
          </h2>
          <p className="text-gray-600 animate-slide-down stagger-2">
            Sign in to manage your construction projects with ease
          </p>
        </div>

        <Card className="mt-8 shadow-strong border-0 animate-slide-up stagger-3 hover-lift">
          <Card.Content className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 animate-slide-down">
                  <div className="flex items-center">
                    <span className="text-danger-500 mr-2">⚠️</span>
                    <p className="text-sm text-danger-600 font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="animate-slide-up stagger-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  placeholder="Enter your email"
                  leftIcon={<span>📧</span>}
                />
              </div>

              <div className="animate-slide-up stagger-5">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  placeholder="Enter your password"
                  leftIcon={<span>🔒</span>}
                />
              </div>

              <div className="flex items-center justify-between animate-slide-up stagger-6">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 transition-colors font-medium hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="animate-slide-up stagger-7">
                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  className="mt-6 h-12 text-base font-semibold shadow-colored hover:shadow-colored-lg transition-all"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                {/* Bypass login button for testing */}
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  className="mt-3 h-12 text-base font-semibold"
                  onClick={handleBypassLogin}
                >
                  Bypass Login (Testing Only)
                </Button>
              </div>
            </form>
          </Card.Content>

          <Card.Footer className="bg-gray-50/50 rounded-b-xl animate-slide-up stagger-8">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </Card.Footer>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-6 border-0 shadow-medium animate-slide-up stagger-9">
          <Card.Content className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600">🔑</span>
              </div>
              <h3 className="text-sm font-semibold text-blue-800">
                Demo Credentials
              </h3>
            </div>
            <div className="text-xs text-blue-700 space-y-2">
              <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                <span>
                  <strong>Admin:</strong> admin@demo.com
                </span>
                <span className="text-blue-600 font-mono">password123</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                <span>
                  <strong>Manager:</strong> manager@demo.com
                </span>
                <span className="text-blue-600 font-mono">password123</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                <span>
                  <strong>Employee:</strong> employee@demo.com
                </span>
                <span className="text-blue-600 font-mono">password123</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
