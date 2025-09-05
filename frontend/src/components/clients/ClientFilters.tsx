import React, { useState } from "react";
import {
  ClientListParams,
} from "../../types/client";
import { UserSummary } from "../../types/client";
import {
  CLIENT_STATUSES,
  CLIENT_SOURCES,
  COMPANY_SIZES,
} from "../../types/client";
import { Button } from "../ui/shadcn-button";
import { Input } from "../ui/shadcn-input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";

interface ClientFiltersProps {
  filters: ClientListParams;
  onFilterChange: (filters: Partial<ClientListParams>) => void;
  onReset: () => void;
  assignedUsers: UserSummary[];
  loading?: boolean;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  assignedUsers,
  loading = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof ClientListParams, value: any) => {
    onFilterChange({ [field]: value });
  };

  const handleSelectChange = (field: keyof ClientListParams, value: string | undefined) => {
    // When value is undefined (e.g., "all" selected), we want to remove the filter
    // So we set it to undefined which will be handled properly by the parent component
    onFilterChange({ [field]: value });
  };

  const handleCheckboxChange = (
    field: keyof ClientListParams,
    isChecked: boolean
  ) => {
    onFilterChange({ [field]: isChecked ? true : undefined });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    return (
      value !== undefined &&
      value !== "" &&
      key !== "page" &&
      key !== "limit" &&
      key !== "sortBy" &&
      key !== "sortOrder"
    );
  }).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFiltersCount} active
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
            disabled={activeFiltersCount === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={filters.search || ""}
              onChange={(e) => handleInputChange("search", e.target.value)}
              placeholder="Company, contact, email..."
              disabled={loading}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange(
                  "status",
                  value === "all" ? undefined : value
                )
              }
              value={(filters.status as string) || "all"}
            >
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {CLIENT_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Source</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange(
                  "source",
                  value === "all" ? undefined : value
                )
              }
              value={filters.source || "all"}
            >
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {CLIENT_SOURCES.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assigned To</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange(
                  "assignedTo",
                  value === "all" ? undefined : value
                )
              }
              value={filters.assignedTo?.toString() || "all"}
            >
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="0">Unassigned</SelectItem>
                {assignedUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Company Size</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(
                      "companySize",
                      value === "all" ? undefined : value
                    )
                  }
                  value={filters.companySize || "all"}
                >
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={filters.industry || ""}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                  placeholder="Filter by industry..."
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Minimum Rating</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(
                      "rating",
                      value === "all" ? undefined : value
                    )
                  }
                  value={filters.rating?.toString() || "all"}
                >
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating}+ Star{rating > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="overdue"
                checked={filters.overdue || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("overdue", checked as boolean)
                }
                disabled={loading}
              />
              <Label htmlFor="overdue">Overdue follow-ups</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="convertedOnly"
                checked={filters.convertedOnly || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("convertedOnly", checked as boolean)
                }
                disabled={loading}
              />
              <Label htmlFor="convertedOnly">Converted clients only</Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFilters;
