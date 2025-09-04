import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "employee",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as "admin" | "manager" | "employee",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    }
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
            Create Account
          </h2>
          <p className="text-gray-600 animate-slide-down stagger-2">
            Sign up to manage your construction projects with ease
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="animate-slide-up stagger-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                    placeholder="Enter your first name"
                    leftIcon={<span>👤</span>}
                  />
                </div>

                <div className="animate-slide-up stagger-5">
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                    placeholder="Enter your last name"
                    leftIcon={<span>👤</span>}
                  />
                </div>
              </div>

              <div className="animate-slide-up stagger-6">
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

              <div className="animate-slide-up stagger-7">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      formData.role === "employee"
                        ? "bg-primary-100 text-primary-700 border border-primary-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFormData({ ...formData, role: "employee" })}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      formData.role === "manager"
                        ? "bg-primary-100 text-primary-700 border border-primary-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFormData({ ...formData, role: "manager" })}
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      formData.role === "admin"
                        ? "bg-primary-100 text-primary-700 border border-primary-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="animate-slide-up stagger-8">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  placeholder="Create a password"
                  leftIcon={<span>🔒</span>}
                />
              </div>

              <div className="animate-slide-up stagger-9">
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  placeholder="Confirm your password"
                  leftIcon={<span>🔒</span>}
                />
              </div>

              <div className="animate-slide-up stagger-10">
                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  className="mt-6 h-12 text-base font-semibold shadow-colored hover:shadow-colored-lg transition-all"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Card.Content>

          <Card.Footer className="bg-gray-50/50 rounded-b-xl animate-slide-up stagger-11">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;