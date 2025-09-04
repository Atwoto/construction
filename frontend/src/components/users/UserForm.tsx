import React, { useState, useEffect } from "react";
import { User, CreateUserRequest, UpdateUserRequest } from "../../types";
import Button from "../common/Button";
import Input from "../common/Input";

interface UserFormProps {
  user?: User;
  isEdit?: boolean;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isEdit = false,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "employee" as 'admin' | 'manager' | 'employee',
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isEdit && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "employee",
      }));
    }
  }, [isEdit, user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!isEdit && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        required
      />
      <Input
        label="Phone"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            required
          />
        </div>
      )}
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
