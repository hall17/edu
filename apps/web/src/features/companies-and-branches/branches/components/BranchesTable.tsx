import { ColumnDef } from '@tanstack/react-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Ban, Check, Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useBranchesContext } from '../BranchesContext';

import { BranchesDataTableToolbar } from './BranchesDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
import { Badge } from '@/components/ui/badge';
import { Branch } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function BranchesTable() {
  const { t } = useTranslation();
  const columns = useColumns();

  const { branchesQuery, filters, setFilters } = useBranchesContext();

  const columnFiltersState: ColumnFiltersState = filters.status
    ? [
        {
          id: 'status',
          value: filters.status,
        },
      ]
    : [];

  return (
    <CustomTable
      data={branchesQuery.data?.branches ?? []}
      rowCount={branchesQuery.data?.pagination.count ?? 0}
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      columnFiltersState={columnFiltersState}
      onColumnFiltersChange={(columnFilters) => {
        const status = columnFilters.find((c) => c.id === 'status')?.value;

        setFilters({
          ...filters,
          status: status ? status : undefined,
        });
      }}
      CustomToolbar={BranchesDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<Branch>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useBranchesContext();

  return [
    SelectItemColumnDef as ColumnDef<Branch>,
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.name')} />
      ),
      cell: ({ row }) => {
        return <LongText className="max-w-36">{row.getValue('name')}</LongText>;
      },
      meta: { className: 'w-36' },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorKey: 'location',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.location')}
        />
      ),
      cell: ({ row }) => (
        <div className="w-fit text-nowrap">
          {row.getValue('location') || '-'}
        </div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => row.company.name,
      id: 'company',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.company')}
        />
      ),
      cell: ({ row }) => (
        <div className="w-fit text-nowrap">{row.original.company.name}</div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => row.modules?.length || 0,
      id: 'modules',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.modules')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.modules?.length || 0}
        </div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => row.students?.length || 0,
      id: 'students',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.students')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.students?.length || 0}
        </div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => row.parents?.length || 0,
      id: 'parents',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.parents')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.parents?.length || 0}
        </div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => row.users?.length || 0,
      id: 'users',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.users')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.users?.length || 0}
        </div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => row.roles?.length || 0,
      id: 'roles',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.branches.table.columns.roles')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.roles?.length || 0}
        </div>
      ),
      enableHiding: true,
      enableResizing: true,
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
              {t(`branchStatuses.${status}`)}
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

      cell: ({ row }) => {
        const isActive = row.original.status === 'ACTIVE';

        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <Eye className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('view');
                },
                tooltip: t('common.view'),
              },
              {
                icon: <Pencil className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('common.edit'),
              },
              {
                icon: isActive ? (
                  <Ban className="size-5" />
                ) : (
                  <Check className="size-5" />
                ),
                className: isActive
                  ? 'hover:text-destructive'
                  : 'hover:text-green-500',
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('suspend');
                },
                tooltip: isActive ? t('common.suspend') : t('common.activate'),
              },
              {
                icon: <Trash2 className="size-5" />,
                className: 'hover:text-red-500',
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('delete');
                },
                tooltip: t('common.delete'),
              },
            ]}
          />
        );
      },
    },
  ];
}
