import { ScheduleType, ScoringType } from '@edusama/common';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Ban, Check, Edit, Eye, School, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAssessmentsContext } from '../AssessmentsContext';

import { AssessmentsDataTableToolbar } from './AssessmentsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable } from '@/components/table';
import { DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function AssessmentsTable() {
  const { assessmentsQuery, filters, setFilters } = useAssessmentsContext();
  const columns = useColumns();

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
      data={assessmentsQuery.data?.assessments ?? []}
      rowCount={assessmentsQuery.data?.pagination?.count ?? 0}
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
      CustomToolbar={AssessmentsDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<Assessment>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useAssessmentsContext();

  return [
    SelectItemColumnDef as ColumnDef<Assessment>,
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.title')} />
      ),
      cell: ({ row }) => {
        const title = row.getValue('title');
        return <LongText className="max-w-36">{title as string}</LongText>;
      },
      enableResizing: true,
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
        const description = row.getValue('description');
        return (
          <LongText className="max-w-48">{description as string}</LongText>
        );
      },
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorKey: 'maxPoints',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assessments.maxPoints')}
        />
      ),
      cell: ({ row }) => {
        const maxPoints = row.getValue('maxPoints');
        return <div className="w-fit text-nowrap">{maxPoints as number}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'scheduleType',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assessments.scheduleType')}
        />
      ),
      cell: ({ row }) => {
        const scheduleType = row.getValue('scheduleType');
        return (
          <div className="capitalize">
            {t(`assessmentScheduleTypes.${scheduleType as ScheduleType}`)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'scoringType',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assessments.scoringType')}
        />
      ),
      cell: ({ row }) => {
        const scoringType = row.getValue('scoringType');
        return (
          <div className="capitalize">
            {t(`assessmentScoringTypes.${scoringType as ScoringType}`)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
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
              {t(`assessmentStatuses.${status}`)}
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
      meta: {
        className: 'text-end',
      },
      enableHiding: false,
      cell: ({ row }) => {
        const isActive = row.original.status === 'ACTIVE';

        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <Eye className="size-4" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('view');
                },
                tooltip: t('common.view'),
              },
              {
                icon: <Edit className="size-4" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('common.edit'),
              },
              {
                icon: <School className="size-4" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('assignToClassroom');
                },
                tooltip: t('assessments.table.actions.assignToClassroom'),
              },
              {
                icon: isActive ? (
                  <Ban className="size-4" />
                ) : (
                  <Check className="size-4" />
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
                icon: <Trash2 className="size-4" />,
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
