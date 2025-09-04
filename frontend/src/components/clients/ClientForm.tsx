import React, { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Client,
  ClientFormData,
  CLIENT_STATUSES,
  CLIENT_SOURCES,
  COMPANY_SIZES,
  CONTACT_METHODS,
} from "../../types/client";
import { Input } from "../ui/shadcn-input";
import { Button } from "../ui/shadcn-button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

// Define the form schema
const clientSchema = yup.object().shape({
  id: yup.string().optional(),
  companyName: yup.string().required("Company name is required"),
  contactPerson: yup.string().required("Contact person is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  alternatePhone: yup.string().optional(),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipCode: yup.string().required("Zip code is required"),
  country: yup.string().optional(),
  website: yup.string().optional(),
  industry: yup.string().optional(),
  companySize: yup
    .string()
    .oneOf(COMPANY_SIZES.map((s) => s.value))
    .optional()
    .nullable(),
  status: yup
    .string()
    .oneOf(CLIENT_STATUSES.map((s) => s.value))
    .optional(),
  source: yup
    .string()
    .oneOf(CLIENT_SOURCES.map((s) => s.value))
    .optional(),
  assignedTo: yup.string().optional().nullable(),
  rating: yup.number().min(1).max(5).optional().nullable(),
  estimatedValue: yup
    .number()
    .min(0, "Value cannot be negative")
    .optional()
    .nullable(),
  notes: yup.string().optional(),
  tags: yup.array().of(yup.string().required()).optional(),
  lastContactDate: yup.string().optional().nullable(),
  nextFollowUpDate: yup.string().optional().nullable(),
  preferredContactMethod: yup
    .string()
    .oneOf(CONTACT_METHODS.map((c) => c.value))
    .optional(),
  timezone: yup.string().optional(),
  customFields: yup.object().optional(),
});

interface ClientFormProps {
  client?: Client;
  isEdit?: boolean;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  isEdit = false,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      companyName: client?.companyName || "",
      contactPerson: client?.contactPerson || "",
      email: client?.email || "",
      phone: client?.phone || "",
      status: client?.status || "lead",
      source: client?.source || "website",
      address: client?.address || "",
      city: client?.city || "",
      state: client?.state || "",
      zipCode: client?.zipCode || "",
      country: client?.country || "",
      website: client?.website || "",
      industry: client?.industry || "",
      companySize: client?.companySize || undefined,
      rating: client?.rating || undefined,
      assignedTo: client?.assignedTo || undefined,
      estimatedValue: client?.estimatedValue || undefined,
      notes: client?.notes || "",
      tags: client?.tags || [],
      lastContactDate: client?.lastContactDate || undefined,
      nextFollowUpDate: client?.nextFollowUpDate || undefined,
      preferredContactMethod: client?.preferredContactMethod || "email",
      timezone: client?.timezone || "",
    },
  });

  useEffect(() => {
    reset({
      companyName: client?.companyName || "",
      contactPerson: client?.contactPerson || "",
      email: client?.email || "",
      phone: client?.phone || "",
      status: client?.status || "lead",
      source: client?.source || "website",
      address: client?.address || "",
      city: client?.city || "",
      state: client?.state || "",
      zipCode: client?.zipCode || "",
      country: client?.country || "",
      website: client?.website || "",
      industry: client?.industry || "",
      companySize: client?.companySize || undefined,
      rating: client?.rating || undefined,
      assignedTo: client?.assignedTo || undefined,
      estimatedValue: client?.estimatedValue || undefined,
      notes: client?.notes || "",
      tags: client?.tags || [],
      lastContactDate: client?.lastContactDate || undefined,
      nextFollowUpDate: client?.nextFollowUpDate || undefined,
      preferredContactMethod: client?.preferredContactMethod || "email",
      timezone: client?.timezone || "",
    });
  }, [client, reset]);

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    try {
      const dataToSend: ClientFormData = {
        ...data,
        companySize: data.companySize ?? undefined,
        assignedTo: data.assignedTo ?? undefined,
        rating: data.rating ? Number(data.rating) : undefined,
        estimatedValue: data.estimatedValue
          ? Number(data.estimatedValue)
          : undefined,
        lastContactDate: data.lastContactDate
          ? new Date(data.lastContactDate).toISOString()
          : undefined,
        nextFollowUpDate: data.nextFollowUpDate
          ? new Date(data.nextFollowUpDate).toISOString()
          : undefined,
      };
      await onSubmit(dataToSend);
    } catch (error) {
      // Error handled by toast in parent component
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" {...register("companyName")} />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyName.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" {...register("contactPerson")} />
              {errors.contactPerson && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactPerson.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Address Information
          </h3>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input id="address" {...register("address")} />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message?.toString()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" {...register("state")} />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.state.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input id="zipCode" {...register("zipCode")} />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.zipCode.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="United States"
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register("website")}
                placeholder="https://"
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.website.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Business Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENT_SOURCES.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.source && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.source.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" {...register("industry")} />
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.industry.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Controller
                name="companySize"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.companySize && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companySize.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                {...register("rating")}
                min={1}
                max={5}
                placeholder="3"
              />
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rating.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedValue">Estimated Value (€)</Label>
            <Input
              id="estimatedValue"
              type="number"
              {...register("estimatedValue")}
              placeholder="0"
            />
            {errors.estimatedValue && (
              <p className="text-red-500 text-xs mt-1">
                {errors.estimatedValue.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Follow-up Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Follow-up Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastContactDate">Last Contact Date</Label>
              <Controller
                name="lastContactDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Select date"
                  />
                )}
              />
              {errors.lastContactDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastContactDate.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
              <Controller
                name="nextFollowUpDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Select date"
                  />
                )}
              />
              {errors.nextFollowUpDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nextFollowUpDate.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Notes
          </h3>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any additional information about the client..."
            ></textarea>
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">
                {errors.notes.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Client"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
