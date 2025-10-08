import { DeviceCondition, DeviceStatus } from '@edusama/server';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { conditionTypes, deviceCategories, statusTypes } from '../data/data';

import { DataTableRowActions } from './DataTableRowActions';

import { LongText } from '@/components/LongText';
import { DataTableColumnHeader } from '@/components/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AuthUser, AuthUserDevice } from '@/stores/authStore';

export const useInventoryColumns = (): ColumnDef<AuthUserDevice>[] => {
  const { t } = useTranslation();

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
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
      id: 'model',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.device')}
        />
      ),
      cell: ({ row }) => {
        const device = row.original.device;
        return (
          <LongText className="max-w-36">{device.model ?? 'N/A'}</LongText>
        );
      },
      meta: { className: 'w-48' },
    },
    {
      id: 'assetTag',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.assetTag')}
        />
      ),
      cell: ({ row }) => {
        const device = row.original.device;
        return (
          <LongText className="max-w-36">{device.assetTag ?? '-'}</LongText>
        );
      },
      meta: { className: 'w-48' },
    },
    {
      id: 'serialNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.serialNumber')}
        />
      ),
      cell: ({ row }) => {
        const device = row.original.device;
        return (
          <div className="w-fit font-mono text-sm text-nowrap">
            {device?.serialNumber || '-'}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.category')}
        />
      ),
      cell: ({ row }) => {
        const device = row.original.device;
        const category = deviceCategories.find(
          (cat) => cat.value === device?.deviceType
        );

        return (
          <div className="flex items-center gap-x-2">
            {category?.icon && (
              <category.icon size={16} className="text-muted-foreground" />
            )}
            <span className="text-sm capitalize">
              {category?.label || device?.deviceType || 'Unknown'}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const device = row.original.device;
        return value.includes(device?.deviceType);
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.status')}
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as DeviceStatus;
        const badgeColor = statusTypes.get(status);
        return (
          <div className="flex space-x-2">
            <Badge variant="outline" className={cn('capitalize', badgeColor)}>
              {t(`deviceStatuses.${status}`)}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'assignedAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.assignedDate')}
        />
      ),
      cell: ({ row }) => {
        const date = row.getValue('assignedAt') as Date;
        return (
          <div className="text-sm">{dayjs(date).format('DD/MM/YYYY')}</div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'expectedReturnAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.expectedReturn')}
        />
      ),
      cell: ({ row }) => {
        const date = row.getValue('expectedReturnAt') as Date | null;
        return (
          <div className="text-sm">
            {date ? dayjs(date).format('DD/MM/YYYY') : ''}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'conditionAtAssignment',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('settings.inventory.columns.condition')}
        />
      ),
      cell: ({ row }) => {
        const condition = row.getValue(
          'conditionAtAssignment'
        ) as DeviceCondition;
        const badgeColor = conditionTypes.get(condition);
        return (
          <div className="flex space-x-2">
            <Badge variant="outline" className={cn('capitalize', badgeColor)}>
              {t(`deviceConditions.${condition}`)}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
    },
    {
      id: 'actions-item',
      cell: DataTableRowActions,
    },
  ];
};
