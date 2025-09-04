import React, { useState, useEffect } from "react";
import { ClientContact, ContactRole } from "../../types";
import Button from "../common/Button";
import Input from "../common/Input";

interface ClientContactFormProps {
  contact?: ClientContact;
  isEdit?: boolean;
  onSubmit: (contact: Omit<ClientContact, "id" | "clientId">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ClientContactForm: React.FC<ClientContactFormProps> = ({
  contact,
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
    role: "primary" as ContactRole,
    isPrimary: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (isEdit && contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        role: contact.role || "primary",
        isPrimary: contact.isPrimary || false,
        isActive: contact.isActive ?? true,
        createdAt: contact.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [isEdit, contact]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <Input
        label="Role"
        value={formData.role}
        onChange={(e) => handleInputChange("role", e.target.value)}
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPrimary"
          checked={formData.isPrimary}
          onChange={(e) => handleInputChange("isPrimary", e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
          Primary Contact
        </label>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? "Update Contact" : "Add Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ClientContactForm;
