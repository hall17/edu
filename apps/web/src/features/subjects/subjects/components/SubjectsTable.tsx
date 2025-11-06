import { SubjectStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  ColumnDef,
  Row,
  VisibilityState,
} from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useSubjectsContext } from '../SubjectsContext';

import { SubjectsDataTableToolbar } from './SubjectsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
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
import { Subject, trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function SubjectsTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { subjectsQuery, filters, setFilters } = useSubjectsContext();
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
      data={subjectsQuery.data?.subjects ?? []}
      rowCount={subjectsQuery.data?.count ?? 0}
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
      CustomToolbar={SubjectsDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<Subject>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useSubjectsContext();

  return [
    SelectItemColumnDef as ColumnDef<Subject>,
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subjects.table.name')}
        />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-48">{row.getValue('name')}</LongText>
      ),
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      id: 'curriculums',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subjects.table.curriculums')}
        />
      ),
      cell: ({ row }) => {
        const count = row.original.curriculums?.length || 0;
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {count} {t('curriculums.table.curriculum')}
            </Badge>
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
      cell: ({ row }) => <SubjectsStatusCell row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <Eye className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('view');
                },
                tooltip: t('students.table.actions.view'),
              },
              {
                icon: <Edit className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('students.table.actions.edit'),
              },
              {
                icon: <Trash2 className="size-5" />,
                className: 'hover:text-red-500',
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('delete');
                },
                tooltip: t('students.table.actions.delete'),
              },
            ]}
          />
        );
      },
    },
  ];
}

interface SubjectsStatusCellProps {
  row: Row<Subject>;
}

function SubjectsStatusCell({ row }: SubjectsStatusCellProps) {
  const { t } = useTranslation();
  const { subjectsQuery } = useSubjectsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.subject.update.mutationOptions({
      onSuccess: () => {
        subjectsQuery.refetch();
        toast.success(t('subjects.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('subjects.updateStatusError'));
      },
    })
  );

  function handleStatusChange(newStatus: SubjectStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
      });
    }
  }

  const subjectStatuses = Object.values(SubjectStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`subjectStatuses.${status}`)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {t('subjects.statusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('subjects.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('subjects.statusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`subjectStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('subjects.statusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(value as SubjectStatus)
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjectStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(`subjectStatuses.${statusOption}`)}
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
