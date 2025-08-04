import { UserStatus } from '@prisma/client';
import {
  IconBan,
  IconCheck,
  IconEdit,
  IconEye,
  IconLock,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { ColumnFiltersState, Row } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useParentsContext } from '../ParentsContext';

import { ParentsDataTableToolbar } from './ParentsDataTableToolbar';

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
import { Parent, trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function ParentsTable() {
  const { parentsQuery, filters, setFilters } = useParentsContext();
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
      data={parentsQuery.data?.parents ?? []}
      rowCount={parentsQuery.data?.count ?? 0}
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
      CustomToolbar={ParentsDataTableToolbar}
    />
  );
}

function useColumns(): ColumnDef<Parent>[] {
  const { t } = useTranslation();
  const { setCurrentRow, setOpenedDialog } = useParentsContext();

  return [
    SelectItemColumnDef as ColumnDef<Parent>,
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
      cell: ({ row }) => <ParentsStatusCell row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      enableHiding: false,
      cell: ({ row }) => {
        const isActive = row.original.status === 'ACTIVE';

        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <IconEye className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('view');
                },
                tooltip: t('common.view'),
              },
              {
                icon: <IconEdit className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('common.edit'),
              },
              {
                icon: <IconLock className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('changePassword');
                },
                tooltip: t('common.changePassword'),
              },
              {
                icon: isActive ? (
                  <IconBan className="size-5" />
                ) : (
                  <IconCheck className="size-5" />
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
                icon: <IconTrash className="size-5" />,
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

interface ParentsStatusCellProps {
  row: Row<Parent>;
}

function ParentsStatusCell({ row }: ParentsStatusCellProps) {
  const { t } = useTranslation();
  const { parentsQuery } = useParentsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: () => {
        parentsQuery.refetch();
        toast.success(t('parents.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('parents.updateStatusError'));
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
              {t('parents.statusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('parents.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('parents.statusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`userStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('parents.statusDialog.newStatus')}
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
