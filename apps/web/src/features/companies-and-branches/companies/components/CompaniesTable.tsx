import { ColumnDef } from '@tanstack/react-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Ban, Check, Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCompaniesContext } from '../CompaniesContext';

import { CompaniesDataTableToolbar } from './CompaniesDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function CompaniesTable() {
  const { t } = useTranslation();
  const columns = useColumns();

  const { companiesQuery, filters, setFilters } = useCompaniesContext();

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
      data={companiesQuery.data?.companies ?? []}
      rowCount={companiesQuery.data?.pagination.count ?? 0}
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
      CustomToolbar={CompaniesDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<Company>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useCompaniesContext();

  return [
    SelectItemColumnDef as ColumnDef<Company>,
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
      accessorKey: 'slug',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.companies.table.columns.slug')}
        />
      ),
      cell: ({ row }) => (
        <div className="w-fit text-nowrap">{row.getValue('slug')}</div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      id: 'branches',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.companies.table.columns.branches')}
        />
      ),
      cell: ({ row }) => {
        const branches = row.original.branches || [];
        return <div className="text-center font-medium">{branches.length}</div>;
      },
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => {
        const branches = row.branches || [];
        return branches.reduce(
          (total, branch) => total + (branch._count?.classrooms || 0),
          0
        );
      },
      id: 'classrooms',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.companies.table.columns.classrooms')}
        />
      ),
      cell: ({ row }) => {
        const branches = row.original.branches || [];
        const totalClassrooms = branches.reduce(
          (total, branch) => total + (branch._count?.classrooms || 0),
          0
        );
        return <div className="text-center font-medium">{totalClassrooms}</div>;
      },
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorFn: (row) => {
        const branches = row.branches || [];
        return branches.reduce(
          (total, branch) => total + (branch._count?.students || 0),
          0
        );
      },
      id: 'students',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('companiesAndBranches.companies.table.columns.students')}
        />
      ),
      cell: ({ row }) => {
        const branches = row.original.branches || [];
        const totalStudents = branches.reduce(
          (total, branch) => total + (branch._count?.students || 0),
          0
        );
        return <div className="text-center font-medium">{totalStudents}</div>;
      },
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
              {t(`companyStatuses.${status}`)}
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
