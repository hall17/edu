import { UserStatus } from '@edusama/server';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Ban, Check, Edit, Eye, Lock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useUsersContext } from '../UsersContext';

import { UsersDataTableToolbar } from './UsersDataTableToolbar';

import countries from '@/assets/countries.json';
import { LongText } from '@/components/LongText';
import { CustomTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { User, trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function UsersTable() {
  const { t } = useTranslation();
  const columns = useColumns();

  const { usersQuery, filters, setFilters } = useUsersContext();

  const columnFiltersState: ColumnFiltersState = filters.status
    ? [
        {
          id: 'status',
          value: filters.status,
        },
      ]
    : [];

  if (filters.roleIds) {
    columnFiltersState.push({
      id: 'role',
      value: filters.roleIds,
    });
  }

  return (
    <CustomTable
      data={usersQuery.data?.users ?? []}
      rowCount={usersQuery.data?.count ?? 0}
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      columnFiltersState={columnFiltersState}
      onColumnFiltersChange={(columnFilters) => {
        console.log('columnFilters', columnFilters);
        const status = columnFilters.find((c) => c.id === 'status')?.value;
        const role = columnFilters.find((c) => c.id === 'role')?.value;
        setFilters({
          ...filters,
          status: status ? status : undefined,
          roleIds: role ? role : undefined,
        });
      }}
      CustomToolbar={UsersDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<User>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useUsersContext();

  return [
    SelectItemColumnDef as ColumnDef<User>,
    {
      accessorKey: 'profilePictureUrl',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="" />
      ),
      cell: ({ row }) => {
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                row.original.profilePictureUrl ||
                `https://testingbot.com/free-online-tools/random-avatar/100?u=${row.original.id}`
              }
              alt={`${row.original.firstName} ${row.original.lastName}`}
            />
            <AvatarFallback className="text-xs">
              {row.original.firstName.charAt(0) +
                row.original.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'fullName',
      accessorFn: (row) => {
        const { firstName, lastName } = row;
        return `${firstName} ${lastName}`;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.fullName')} />
      ),
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        const fullName = `${firstName} ${lastName}`;
        return <LongText className="max-w-36">{fullName}</LongText>;
      },
      meta: { className: 'w-36' },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.email')} />
      ),
      cell: ({ row }) => (
        <div className="w-fit text-nowrap">{row.getValue('email')}</div>
      ),
      enableHiding: true,
      enableResizing: true,
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('common.phoneNumber')}
        />
      ),
      cell: ({ row }) => {
        const phoneNumber = row.getValue('phoneNumber');

        if (!phoneNumber) {
          return null;
        }

        const countryCode = countries.find(
          (country) => country.iso2 === row.original.phoneCountryCode
        );
        const phoneNumberWithCountryCode = `+${countryCode?.phoneCode} ${phoneNumber}`;
        return <div>{phoneNumberWithCountryCode}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => <UsersStatusCell row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.role')} />
      ),
      cell: ({ row }) => {
        const roles = row.original.roles
          .map((role) => role.role.name)
          .join(', ');

        return (
          <div className="flex items-center gap-x-2">
            <span className="text-sm capitalize">{roles}</span>
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
                icon: <Edit className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('common.edit'),
              },
              {
                icon: <Lock className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('changePassword');
                },
                tooltip: t('common.changePassword'),
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

interface UsersStatusCellProps {
  row: Row<User>;
}

function UsersStatusCell({ row }: UsersStatusCellProps) {
  const { t } = useTranslation();
  const { usersQuery } = useUsersContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: () => {
        usersQuery.refetch();
        toast.success(t('users.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('users.updateStatusError'));
      },
    })
  );

  function handleStatusChange(newStatus: UserStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
        statusUpdateReason: `Status changed from ${status} to ${newStatus}`,
      });
    }
  }

  const userStatuses = Object.values(UserStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`userStatuses.${status}`)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {t('users.statusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('users.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('users.statusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`userStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('users.statusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) => handleStatusChange(value as UserStatus)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(`userStatuses.${statusOption}`)}
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
