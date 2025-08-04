import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { MaterialsDataTableRowActions } from './MaterialsDataTableRowActions';

import { LongText } from '@/components/LongText';
import { DataTableColumnHeader } from '@/components/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Curriculum } from '@/lib/trpc';
import { cn } from '@/lib/utils';

export const getColumns = (t: TFunction): ColumnDef<Curriculum>[] => [
  {
    id: 'select-item',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        'sticky left-0 z-10 rounded-tl md:table-cell',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('materials.table.subject')}
      />
    ),
    cell: ({ row }) => {
      const subject = row.original.subject;
      return <div>{subject.name}</div>;
    },
    meta: { className: 'w-40' },
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: 'curriculum',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('materials.table.curriculum')}
      />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-48">{row.original.name}</LongText>
    ),
    meta: { className: 'w-48' },
    enableHiding: true,
    enableResizing: true,
    enableSorting: true,
  },

  {
    accessorKey: 'lessons',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('materials.table.lessons')}
      />
    ),
    cell: ({ row }) => {
      const lessons = row.original.lessons || [];
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {lessons.length}{' '}
            {t('materials.table.lesson', { count: lessons.length })}
          </Badge>
        </div>
      );
    },
    meta: { className: 'w-32' },
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: 'actions-item',
    header: t('common.actions'),
    cell: MaterialsDataTableRowActions,
    enableHiding: false,
  },
];
