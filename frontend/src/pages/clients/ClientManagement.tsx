import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  Client,
  ClientListParams,
  ClientStats,
  ClientSortField,
  ClientStatus,
  UserSummary,
  CreateClientData,
} from "../../types/client";
import { clientService } from "../../services/clientService";
import { userService } from "../../services/userService";
import {
  ClientTable,
  ClientCard,
  ClientFilters,
  ClientStats as ClientStatsDisplay,
  ClientForm,
} from "../../components/clients";
import { Button } from "../../components/ui/shadcn-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/AlertDialog";

type ViewMode = "table" | "cards";

const ClientManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string>("");

  // Pagination and filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10,
  });
  const [filters, setFilters] = useState<ClientListParams>({
    page: 1,
    limit: 10,
    sortBy: "companyName",
    sortOrder: "ASC",
  });

  // UI states
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  useEffect(() => {
    loadClients();
    loadStats();
    loadAssignedUsers();
  }, [filters]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClients(filters);
      setClients(response.clients);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");
      const clientStats = await clientService.getClientStats();
      setStats(clientStats);
    } catch (error: any) {
      setStatsError(
        error.response?.data?.message || "Failed to load statistics"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  const loadAssignedUsers = async () => {
    try {
      const users = await userService.getUsersSummary();
      // Ensure we always have an array, even if the API returns something unexpected
      setAssignedUsers(Array.isArray(users) ? users : []);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      // Set to empty array on error to prevent UI issues
      setAssignedUsers([]);
    }
  };

  const handleFilterChange = (newFilters: Partial<ClientListParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change, except for pagination itself
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (field: ClientSortField, order: "ASC" | "DESC") => {
    setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: order }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "companyName",
      sortOrder: "ASC",
    });
  };

  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      await clientService.createClient(clientData as CreateClientData);
      toast.success("Client created successfully");
      setShowCreateModal(false);
      loadClients();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create client");
      throw error;
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleUpdateClient = async (clientData: Partial<Client>) => {
    if (!selectedClient) return;
    try {
      await clientService.updateClient(selectedClient.id, clientData);
      toast.success("Client updated successfully");
      setShowEditModal(false);
      setSelectedClient(null);
      loadClients();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update client");
      throw error;
    }
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await clientService.deleteClient(selectedClient.id);
      toast.success("Client deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedClient(null);
      loadClients();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete client");
    }
  };

  const handleUpdateStatus = async (client: Client, status: ClientStatus) => {
    try {
      await clientService.updateClientStatus(client.id, status);
      toast.success("Client status updated");
      loadClients();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleViewClient = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your construction clients
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📋 Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🗂️ Cards
            </button>
          </div>

          {/* Create Client Button */}
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>➕ New Client</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Client</DialogTitle>
              </DialogHeader>
              <ClientForm
                onSubmit={handleCreateClient}
                onCancel={() => setShowCreateModal(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <ClientStatsDisplay
        stats={stats}
        loading={statsLoading}
        error={statsError}
      />

      {/* Filters */}
      <ClientFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        assignedUsers={assignedUsers}
        loading={loading}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {pagination.totalClients > 0 ? (
            <>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalClients
              )}{" "}
              of {pagination.totalClients} clients
            </>
          ) : (
            "No clients found"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>Per page:</span>
          <select
            value={filters.limit}
            onChange={(e) =>
              handleFilterChange({ limit: parseInt(e.target.value), page: 1 })
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Client List */}

      {viewMode === "table" ? (
        <ClientTable
          clients={clients}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleEditClient}
          onView={handleViewClient}
          onDelete={handleDeleteClient}
          onUpdateStatus={handleUpdateStatus}
          currentUserId={currentUser?.id.toString()}
          sortBy={filters.sortBy as ClientSortField}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
          selectedClients={selectedClients}
          onSelectionChange={setSelectedClients}
        />
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : clients.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onView={handleViewClient}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                  />
                ))}
              </div>

              {/* Pagination for cards view */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No clients found</div>
              <div className="text-gray-400 text-sm mb-6">
                {Object.keys(filters).some(
                  (key) =>
                    filters[key as keyof ClientListParams] &&
                    key !== "page" &&
                    key !== "limit" &&
                    key !== "sortBy" &&
                    key !== "sortOrder"
                )
                  ? "Try adjusting your search filters"
                  : "Get started by creating your first client"}
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                ➕ Create First Client
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              client={selectedClient}
              isEdit
              onSubmit={handleUpdateClient}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedClient?.companyName}?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClient}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientManagement;
