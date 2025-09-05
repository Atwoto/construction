import React from "react";
import { Client, ClientStatus, ClientSortField, ClientPagination } from "../../types/client";
import { Button } from "../ui/shadcn-button";
import { Checkbox } from "../ui/Checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/DropdownMenu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/Pagination";
import { ArrowUpDown, Loader2, MoreHorizontal } from "lucide-react";

interface ClientTableProps {
  clients: Client[];
  loading?: boolean;
  pagination: ClientPagination;
  onPageChange: (page: number) => void;
  onEdit?: (client: Client) => void;
  onView?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onUpdateStatus?: (client: Client, status: ClientStatus) => void;
  currentUserId?: string;
  sortBy?: ClientSortField;
  sortOrder?: "ASC" | "DESC";
  onSort?: (field: ClientSortField, order: "ASC" | "DESC") => void;
  selectedClients?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  loading = false,
  pagination,
  onPageChange,
  onEdit,
  onView,
  onDelete,
  onUpdateStatus,
  currentUserId,
  sortBy,
  sortOrder,
  onSort,
  selectedClients = [],
  onSelectionChange,
}) => {
  const handleSort = (field: ClientSortField) => {
    if (!onSort) return;
    const newOrder = sortBy === field && sortOrder === "ASC" ? "DESC" : "ASC";
    onSort(field, newOrder);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? clients.map((client) => client.id) : []);
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      checked
        ? [...selectedClients, clientId]
        : selectedClients.filter((id) => id !== clientId)
    );
  };

  const renderSortIcon = (field: ClientSortField) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "ASC" ? <ArrowUpDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead>
                  <Checkbox
                    checked={selectedClients.length === clients.length && clients.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead onClick={() => handleSort("companyName")} className="cursor-pointer">
                Company {renderSortIcon("companyName")}
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                {onSelectionChange && (
                  <TableCell>
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">{client.companyName}</TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>{client.estimatedValue}</TableCell>
                <TableCell>{client.lastContactDate ? new Date(client.lastContactDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{client.assignedUser ? `${client.assignedUser.firstName} ${client.assignedUser.lastName}` : 'Unassigned'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && <DropdownMenuItem onClick={() => onView(client)}>View</DropdownMenuItem>}
                      {onEdit && <DropdownMenuItem onClick={() => onEdit(client)}>Edit</DropdownMenuItem>}
                      {onDelete && <DropdownMenuItem onClick={() => onDelete(client)}>Delete</DropdownMenuItem>}
                      {onUpdateStatus && (
                        <>
                          <DropdownMenuSeparator />
                          {["lead", "opportunity", "active", "inactive", "lost"].map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onUpdateStatus(client, status as ClientStatus)}
                              disabled={client.status === status}
                            >
                              Set as {status}
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No clients found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters.</p>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                />
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === pagination.currentPage}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ClientTable;