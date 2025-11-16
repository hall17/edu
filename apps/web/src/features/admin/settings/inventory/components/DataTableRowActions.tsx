import { Row } from '@tanstack/react-table';
import { Eye, FileText, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthUserDevice } from '@/stores/authStore';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const device = row.original as AuthUserDevice;

  const handleViewDetails = () => {
    // TODO: Implement view details functionality
    console.log('View details for:', device);
  };

  const handleViewNotes = () => {
    // TODO: Implement view notes functionality
    console.log('View notes for:', device);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {(device.assignmentNotes || device.returnNotes) && (
          <DropdownMenuItem onClick={handleViewNotes}>
            <FileText className="mr-2 h-4 w-4" />
            View Notes
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
