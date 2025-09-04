import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  X,
  Building,
  Users,
  DollarSign,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "../ui/shadcn-button";
import { Input } from "../ui/shadcn-input";
import { Badge } from "../ui/shadcn-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../ui/DropdownMenu";

interface SearchResult {
  id: string;
  type: "project" | "client" | "invoice" | "document" | "user";
  title: string;
  subtitle: string;
  description?: string;
  url: string;
  metadata?: {
    status?: string;
    amount?: number;
    date?: string;
  };
}

interface SearchFilters {
  types: string[];
  dateRange: "all" | "today" | "week" | "month" | "year";
  status: string[];
}

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    dateRange: "all",
    status: [],
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "project",
      title: "Downtown Office Complex",
      subtitle: "Commercial Project",
      description: "Large-scale office building construction",
      url: "/projects/1",
      metadata: { status: "In Progress", date: "2024-01-15" },
    },
    {
      id: "2",
      type: "client",
      title: "Acme Construction Ltd.",
      subtitle: "Active Client",
      description: "Primary contractor for residential projects",
      url: "/clients/2",
      metadata: { status: "Active" },
    },
    {
      id: "3",
      type: "invoice",
      title: "Invoice #INV-2024-001",
      subtitle: "Downtown Office Complex",
      description: "Monthly progress payment",
      url: "/invoices/3",
      metadata: { status: "Paid", amount: 45000, date: "2024-02-01" },
    },
    {
      id: "4",
      type: "document",
      title: "Building Permits",
      subtitle: "City Hall Renovation",
      description: "Official building permits and approvals",
      url: "/documents/4",
      metadata: { date: "2024-01-20" },
    },
    {
      id: "5",
      type: "user",
      title: "John Smith",
      subtitle: "Project Manager",
      description: "Senior project manager with 10+ years experience",
      url: "/users/5",
      metadata: { status: "Active" },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filteredResults = mockResults.filter((result) => {
          const matchesQuery =
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.subtitle.toLowerCase().includes(query.toLowerCase()) ||
            result.description?.toLowerCase().includes(query.toLowerCase());

          const matchesType =
            filters.types.length === 0 || filters.types.includes(result.type);

          return matchesQuery && matchesType;
        });

        setResults(filteredResults);
        setLoading(false);
        setIsOpen(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, filters]);

  const getResultIcon = (type: SearchResult["type"]) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "project":
        return <Building className={`${iconClass} text-blue-600`} />;
      case "client":
        return <Users className={`${iconClass} text-green-600`} />;
      case "invoice":
        return <DollarSign className={`${iconClass} text-yellow-600`} />;
      case "document":
        return <FileText className={`${iconClass} text-purple-600`} />;
      case "user":
        return <Users className={`${iconClass} text-indigo-600`} />;
      default:
        return <Search className={`${iconClass} text-gray-600`} />;
    }
  };

  const getResultBadgeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-700";
      case "client":
        return "bg-green-100 text-green-700";
      case "invoice":
        return "bg-yellow-100 text-yellow-700";
      case "document":
        return "bg-purple-100 text-purple-700";
      case "user":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      dateRange: "all",
      status: [],
    });
  };

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.dateRange !== "all" ||
    filters.status.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search projects, clients, invoices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-20 h-12 bg-white/90 backdrop-blur-sm border-gray-200 focus:border-primary-500 focus:ring-primary-500"
        />

        {/* Filter Button */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${hasActiveFilters ? "text-primary-600 bg-primary-50" : "text-gray-400"}`}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  Filter by Type
                </h4>
                {["project", "client", "invoice", "document", "user"].map(
                  (type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filters.types.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange("types", [...filters.types, type]);
                        } else {
                          handleFilterChange(
                            "types",
                            filters.types.filter((t) => t !== type)
                          );
                        }
                      }}
                      className="capitalize"
                    >
                      {type}s
                    </DropdownMenuCheckboxItem>
                  )
                )}
              </div>

              <DropdownMenuSeparator />

              <div className="p-2">
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  Date Range
                </h4>
                {[
                  { value: "all", label: "All Time" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "year", label: "This Year" },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      handleFilterChange("dateRange", option.value)
                    }
                    className={
                      filters.dateRange === option.value
                        ? "bg-primary-50 text-primary-700"
                        : ""
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`
                    group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
                    ${index === 0 ? "animate-slide-in-right" : ""}
                  `}
                  onClick={() => {
                    // Handle navigation to result.url
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getResultIcon(result.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                          {result.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {result.subtitle}
                        </p>
                        {result.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {result.description}
                          </p>
                        )}

                        {/* Metadata */}
                        {result.metadata && (
                          <div className="flex items-center space-x-2 mt-2">
                            {result.metadata.status && (
                              <Badge
                                className={`text-xs ${getResultBadgeColor(result.type)}`}
                              >
                                {result.metadata.status}
                              </Badge>
                            )}
                            {result.metadata.amount && (
                              <span className="text-xs text-green-600 font-medium">
                                ${result.metadata.amount.toLocaleString()}
                              </span>
                            )}
                            {result.metadata.date && (
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  result.metadata.date
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Type badge */}
                      <Badge
                        variant="secondary"
                        className="ml-2 capitalize text-xs"
                      >
                        {result.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No results found for "{query}"
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : null}

          {/* Quick Actions */}
          {query && (
            <div className="border-t border-gray-100 p-3 bg-gray-50/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to search all</span>
                <div className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                    ↑
                  </kbd>
                  <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                    ↓
                  </kbd>
                  <span>to navigate</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
