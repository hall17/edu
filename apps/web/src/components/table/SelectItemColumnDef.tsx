import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '../ui/checkbox';

import { cn } from '@/lib/utils';

export function getSelectItemColumnDef(): ColumnDef<any> {
  return {
    id: 'select-item',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    meta: {
      className: cn(
        'sticky left-0 z-10 w-10 rounded-tl md:table-cell',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
  };
}

export const SelectItemColumnDef: ColumnDef<any> = {
  id: 'select-item',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  meta: {
    className: cn(
      'sticky left-0 z-10 w-10 rounded-tl md:table-cell',
      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
    ),
  },
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  ),
  enableHiding: false,
};
