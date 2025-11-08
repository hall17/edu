import { CurriculumStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
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
import { Row } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCurriculumsContext } from '../CurriculumsContext';

import { CurriculumsDataTableToolbar } from './CurriculumsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
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
import { Curriculum, trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function CurriculumsTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { curriculumsQuery, filters, setFilters } = useCurriculumsContext();
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
      data={curriculumsQuery.data?.curriculums ?? []}
      rowCount={curriculumsQuery.data?.count ?? 0}
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
      CustomToolbar={CurriculumsDataTableToolbar}
    />
  );
}

function useColumns(): ColumnDef<Curriculum>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useCurriculumsContext();

  return [
    {
      id: 'select-item',
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      meta: {
        className: cn(
          'sticky left-0 z-10 w-10 rounded-tl md:table-cell',
          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
        ),
      },
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'subject',
      header: ({ column }: any) => (
        <DataTableColumnHeader
          column={column}
          title={t('curriculums.table.subject')}
        />
      ),
      cell: ({ row }: any) => {
        const subject = row.original.subject;
        return <div>{subject.name}</div>;
      },
      enableHiding: true,
    },
    {
      id: 'curriculum',
      header: ({ column }: any) => (
        <DataTableColumnHeader
          column={column}
          title={t('curriculums.table.curriculum')}
        />
      ),
      cell: ({ row }: any) => (
        <LongText className="max-w-48">{row.original.name}</LongText>
      ),
      enableHiding: true,
    },
    {
      accessorKey: 'lessons',
      header: ({ column }: any) => (
        <DataTableColumnHeader
          column={column}
          title={t('curriculums.table.lessons')}
        />
      ),
      cell: ({ row }: any) => {
        const lessons = row.original.lessons || [];
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {lessons.length}{' '}
              {t('curriculums.table.lesson', { count: lessons.length })}
            </Badge>
          </div>
        );
      },
      enableHiding: true,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => <CurriculumsStatusCell row={row} />,
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
      cell: ({ row }) => {
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

interface CurriculumsStatusCellProps {
  row: Row<Curriculum>;
}

function CurriculumsStatusCell({ row }: CurriculumsStatusCellProps) {
  const { t } = useTranslation();
  const { curriculumsQuery } = useCurriculumsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.curriculum.update.mutationOptions({
      onSuccess: () => {
        curriculumsQuery.refetch();
        toast.success(t('curriculums.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('curriculums.updateStatusError'));
      },
    })
  );

  function handleStatusChange(newStatus: CurriculumStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
      });
    }
  }

  const curriculumStatuses = Object.values(CurriculumStatus);

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
              {t('curriculums.statusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('curriculums.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('curriculums.statusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`subjectStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('curriculums.statusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(value as CurriculumStatus)
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {curriculumStatuses.map((statusOption) => (
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
