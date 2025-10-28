import { Row } from '@tanstack/react-table';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassroomsContext } from '../../classrooms/ClassroomsContext';
import { useClassroomTemplatesContext } from '../ClassroomTemplatesContext';

import { ClassroomTemplatesDataTableToolbar } from './ClassroomTemplatesDataTableToolbar';

import { LongText } from '@/components/LongText';
import { DataTableColumnHeader } from '@/components/table';
import { DataTablePagination } from '@/components/table/DataTablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Classroom } from '@/lib/trpc';
import { ClassroomTemplate } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function ClassroomTemplatesTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    templatesQuery,
    filters,
    setFilters,
    setOpenedDialog,
    setCurrentRow,
  } = useClassroomTemplatesContext();

  const handleView = (template: ClassroomTemplate) => {
    setCurrentRow(template);
    setOpenedDialog('view');
  };

  const handleEdit = (template: ClassroomTemplate) => {
    setCurrentRow(template);
    setOpenedDialog('edit');
  };

  const handleDelete = (template: ClassroomTemplate) => {
    setCurrentRow(template);
    setOpenedDialog('delete');
  };

  const columns = useColumns();

  const paginationState: PaginationState = {
    pageIndex: filters.page ? filters.page - 1 : DEFAULT_PAGE_INDEX,
    pageSize: filters.size ?? DEFAULT_PAGE_SIZE,
  };

  const sortingState: SortingState = filters.sort
    ? [
        {
          id: filters.sort.split(':')[0],
          desc: filters.sort.split(':')[1] === 'desc',
        },
      ]
    : [];

  const columnFiltersState: ColumnFiltersState = [];

  const table = useReactTable({
    data: templatesQuery.data?.classroomTemplates ?? [],
    columns,
    state: {
      sorting: sortingState,
      columnVisibility,
      rowSelection,
      columnFilters: columnFiltersState,
      pagination: paginationState,
    },
    enableColumnResizing: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (pagination) => {
      const newPagination =
        typeof pagination === 'function'
          ? pagination(paginationState)
          : pagination;
      setFilters({
        page:
          newPagination.pageIndex === DEFAULT_PAGE_INDEX
            ? undefined
            : newPagination.pageIndex + 1,
        size:
          newPagination.pageSize === DEFAULT_PAGE_SIZE
            ? undefined
            : newPagination.pageSize,
      });
    },
    onSortingChange: (sorting) => {
      const newSorting =
        typeof sorting === 'function' ? sorting(sortingState) : sorting;

      setFilters({
        sort: newSorting?.length
          ? `${newSorting[0].id}:${newSorting[0].desc ? 'desc' : 'asc'}`
          : undefined,
      });
    },
    rowCount: templatesQuery.data?.pagination?.count,
  });

  return (
    <div className="space-y-4">
      <ClassroomTemplatesDataTableToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('classrooms.templates.noTemplates')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export function useColumns(): ColumnDef<ClassroomTemplate>[] {
  const { t } = useTranslation();

  return [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.templates.table.name')}
        />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-48">{row.getValue('name')}</LongText>
      ),
      meta: { className: 'w-48' },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.templates.table.description')}
        />
      ),
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return description ? (
          <LongText className="max-w-64">{description}</LongText>
        ) : (
          <div className="text-muted-foreground">-</div>
        );
      },
      meta: { className: 'w-64' },
      enableHiding: true,
      enableResizing: true,
      enableSorting: false,
    },
    {
      accessorKey: 'capacity',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.templates.table.capacity')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('capacity')}</div>
      ),
      meta: { className: 'w-24' },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'modules',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.templates.table.modules')}
        />
      ),
      cell: ({ row }) => {
        const modules = row.original.modules;
        return <div className="text-center">{modules?.length || 0}</div>;
      },
      meta: { className: 'w-24' },
      enableHiding: true,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div className="flex space-x-2">
            <Badge
              variant={getStatusBadgeVariant(status)}
              className="capitalize"
            >
              {t(`classroomTemplateStatuses.${status}`)}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      cell: ClassroomTemplatesDataTableRowActions,
      enableHiding: false,
    },
  ];
}

interface ClassroomTemplatesDataTableRowActionsProps {
  row: Row<ClassroomTemplate>;
}

export function ClassroomTemplatesDataTableRowActions({
  row,
}: ClassroomTemplatesDataTableRowActionsProps) {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useClassroomTemplatesContext();

  const isActive = row.original.status === 'ACTIVE';

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('view');
            }}
          >
            <Eye className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('classrooms.table.actions.view')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('edit');
            }}
          >
            <Pencil className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('classrooms.table.actions.edit')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0 hover:text-red-500"
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('delete');
            }}
          >
            <Trash2 className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('classrooms.table.actions.delete')}</TooltipContent>
      </Tooltip>
    </div>
  );
}
