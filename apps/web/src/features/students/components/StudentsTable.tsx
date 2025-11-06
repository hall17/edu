import { StudentStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnFiltersState, Row } from '@tanstack/react-table';
import { Ban, Check, Edit, Eye, Lock, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useStudentsContext } from '../StudentsContext';

import { StudentsDataTableToolbar } from './StudentsDataTableToolbar';

import countries from '@/assets/countries.json';
import { LongText } from '@/components/LongText';
import { CustomTable } from '@/components/table';
import { DataTableColumnHeader } from '@/components/table';
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
import { Student, trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function StudentsTable() {
  const { studentsQuery, filters, setFilters } = useStudentsContext();
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
      data={studentsQuery.data?.students ?? []}
      rowCount={studentsQuery.data?.count ?? 0}
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
      CustomToolbar={StudentsDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<Student>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useStudentsContext();

  return [
    SelectItemColumnDef as ColumnDef<Student>,
    {
      accessorKey: 'profilePictureUrl',
      header: '',
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
      enableResizing: true,
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
      cell: ({ row }) => <StudentsStatusCell row={row} />,
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
                icon: <Send className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('resendInvitation');
                },
                tooltip: t('students.table.actions.resendInvitation'),
                hidden: row.original.status !== 'INVITED',
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

interface StudentsStatusCellProps {
  row: Row<Student>;
}

function StudentsStatusCell({ row }: StudentsStatusCellProps) {
  const { t } = useTranslation();
  const { studentsQuery, updateStudentSignupStatus } = useStudentsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.student.updateSignupStatus.mutationOptions({
      onSuccess: () => {
        updateStudentSignupStatus(row.original.id, status);
        studentsQuery.refetch();
        toast.success(t('students.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('students.updateStatusError'));
      },
    })
  );

  function handleStatusChange(newStatus: StudentStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
      });
    }
  }

  const studentStatuses = Object.values(StudentStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`studentStatuses.${status}`)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {t('students.enrollmentStatusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('students.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('students.enrollmentStatusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`studentStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('students.enrollmentStatusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(value as StudentStatus)
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {studentStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(`studentStatuses.${statusOption}`)}
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
