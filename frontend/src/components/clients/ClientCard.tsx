import React from 'react';
import { Client } from '../../types/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/shadcn-card';
import { Button } from '../ui/shadcn-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{client.companyName}</CardTitle>
            <CardDescription>{client.contactPerson}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(client)}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(client)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(client)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 truncate">{client.email}</p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
          >
            {client.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;