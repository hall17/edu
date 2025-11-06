import { RoleStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
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
import { Row } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { Ban, Check, Eye, Pause, Pencil, Play, Trash2 } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useRolesContext } from '../RolesContext';

import { RolesDataTableToolbar } from './RolesDataTableToolbar';

import { LongText } from '@/components/LongText';
import { DataTableColumnHeader } from '@/components/table';
import { DataTablePagination } from '@/components/table/DataTablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Role, trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function RolesTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useColumns();

  const { rolesQuery, filters, setFilters } = useRolesContext();

  const paginationState: PaginationState = {
    pageIndex: filters.page ? filters.page - 1 : DEFAULT_PAGE_INDEX,
    pageSize: filters.size ?? DEFAULT_PAGE_SIZE,
  };

  const sortingState: SortingState = filters.sort
    ? [
        {
          id: filters.sort.split(':')[0] ?? '',
          desc: filters.sort.split(':')[1] === 'desc',
        },
      ]
    : [];

  const columnFiltersState: ColumnFiltersState = filters.status
    ? [
        {
          id: 'status',
          value: filters.status,
        },
      ]
    : [];

  const table = useReactTable({
    data: rolesQuery.data?.roles ?? [],
    columns,
    state: {
      sorting: sortingState,
      columnVisibility,
      rowSelection,
      columnFilters: columnFiltersState,
      pagination: paginationState,
    },
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
          ? `${newSorting?.[0]?.id}:${newSorting?.[0]?.desc ? 'desc' : 'asc'}`
          : undefined,
      });
    },
    onColumnFiltersChange: (columnFilters) => {
      const newColumnFilters =
        typeof columnFilters === 'function'
          ? columnFilters(columnFiltersState)
          : columnFilters;

      const status = newColumnFilters.find((c) => c.id === 'status')?.value;

      setFilters({
        status: status ? status : undefined,
      });
    },
    rowCount: rolesQuery.data?.count,
  });

  return (
    <div className="space-y-4">
      <RolesDataTableToolbar table={table} />
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
                  {t('dataTable.noResults')}
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

function useColumns(): ColumnDef<Role>[] {
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
          aria-label={t('dataTable.selectAll')}
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
          aria-label={t('dataTable.selectRow')}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.name')} />
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
          title={t('common.description')}
        />
      ),
      cell: ({ row }) => {
        return row.original.description ? (
          <LongText className="max-w-64">{row.original.description}</LongText>
        ) : null;
      },
      enableHiding: true,
      enableResizing: true,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => <RolesStatusCell row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      cell: RolesDataTableRowActions,
      enableHiding: false,
    },
  ];
}

interface RolesStatusCellProps {
  row: Row<Role>;
}

function RolesStatusCell({ row }: RolesStatusCellProps) {
  const { t } = useTranslation();
  const { rolesQuery } = useRolesContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.role.update.mutationOptions({
      onSuccess: () => {
        rolesQuery.refetch();
        toast.success(t('roles.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('roles.updateStatusError'));
      },
    })
  );

  function handleStatusChange(newStatus: RoleStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
      });
    }
  }

  const roleStatuses = Object.values(RoleStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`roleStatuses.${status}`)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {t('roles.statusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('roles.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('roles.statusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`roleStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('roles.statusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) => handleStatusChange(value as RoleStatus)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(`roleStatuses.${statusOption}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {updateStatusMutation.isPending && (
            <div className="text-muted-foreground text-sm">
              {t('common.updating')}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface RolesDataTableRowActionsProps {
  row: Row<Role>;
}

function RolesDataTableRowActions({ row }: RolesDataTableRowActionsProps) {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useRolesContext();

  const isSystem = row.original.isSystem;
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
        <TooltipContent>{t('roles.table.actions.view')}</TooltipContent>
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
        <TooltipContent>{t('roles.table.actions.edit')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'data-[state=open]:bg-muted flex h-8 w-8 p-0',
              isActive ? 'hover:text-orange-500' : 'hover:text-green-500'
            )}
            disabled={isSystem}
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('suspend');
            }}
          >
            {isActive ? (
              <Ban className="size-5" />
            ) : (
              <Check className="size-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isSystem
            ? t('roles.table.actions.cannotSuspendSystemRole' as any)
            : isActive
              ? t('roles.table.actions.suspend' as any)
              : t('roles.table.actions.activate' as any)}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0 hover:text-red-500"
            disabled={isSystem}
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('delete');
            }}
          >
            <Trash2 className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isSystem
            ? t('roles.table.actions.cannotDeleteSystemRole')
            : t('roles.table.actions.delete')}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
