import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/shadcn-card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/DropdownMenu';
import { Button } from '../ui/shadcn-button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { cn } from '../../lib/utils';

interface ModernCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  menu?: React.ReactNode;
  className?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  subtitle,
  children,
  menu,
  className,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-yellow-500" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0" style={{paddingBottom: '0px'}}>
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        {menu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ModernCard;
