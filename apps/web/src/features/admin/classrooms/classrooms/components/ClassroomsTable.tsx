import { ClassroomStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
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
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Eye, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomsContext } from '../ClassroomsContext';

import { ClassroomsDataTableToolbar } from './ClassroomsDataTableToolbar';

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
import { Progress } from '@/components/ui/progress';
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
import { Classroom, trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function ClassroomsTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { classroomsQuery, filters, setFilters } = useClassroomsContext();
  const columns = useColumns();

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

  const columnFiltersState: ColumnFiltersState = [];

  const table = useReactTable({
    data: classroomsQuery.data?.classrooms ?? [],
    columns,
    state: {
      sorting: sortingState,
      columnVisibility,
      rowSelection,
      columnFilters: columnFiltersState,
      pagination: paginationState,
    },
    enableColumnResizing: true,
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
    rowCount: classroomsQuery.data?.count,
  });

  return (
    <div className="space-y-4">
      <ClassroomsDataTableToolbar table={table} />
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
                  {t('classrooms.table.noResults')}
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

export function useColumns(): ColumnDef<Classroom>[] {
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.table.name')}
        />
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
      accessorKey: 'capacity',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.table.capacity')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('capacity')}</div>
      ),
      meta: { className: 'w-24' },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.table.startDate')}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('startDate'));
        return <div>{format(date, 'dd/MM/yyyy')}</div>;
      },
      meta: { className: 'w-32' },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.table.endDate')}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('endDate'));
        return <div>{format(date, 'dd/MM/yyyy')}</div>;
      },
      meta: { className: 'w-32' },
      enableHiding: true,
      enableSorting: true,
    },
    {
      id: 'progress',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('classrooms.table.progress')}
        />
      ),
      cell: ({ row }) => <ClassroomProgressCell row={row} />,
      meta: { className: 'w-48' },
      enableHiding: true,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => <ClassroomsStatusCell row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      cell: ClassroomsDataTableRowActions,
      enableHiding: false,
    },
  ];
}

interface ClassroomProgressCellProps {
  row: Row<Classroom>;
}

function ClassroomProgressCell({ row }: ClassroomProgressCellProps) {
  const { t } = useTranslation();
  const classroom = row.original;

  const totalSessions = classroom.integrations.reduce((total, integration) => {
    return total + (integration.classroomIntegrationSessions?.length ?? 0);
  }, 0);

  const completedSessions = classroom.integrations.reduce(
    (completed, integration) => {
      const integrationCompleted =
        integration.classroomIntegrationSessions?.filter(
          (session) => session.isAttendanceRecordCompleted
        ).length ?? 0;
      return completed + integrationCompleted;
    },
    0
  );

  const progressPercentage =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  const getProgressVariant = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completedSessions} / {totalSessions}
        </span>
        <span className="font-medium">{progressPercentage}%</span>
      </div>
      <Progress
        value={progressPercentage}
        variant={getProgressVariant(progressPercentage)}
        className="h-2"
      />
    </div>
  );
}

interface ClassroomsStatusCellProps {
  row: Row<Classroom>;
}

function ClassroomsStatusCell({ row }: ClassroomsStatusCellProps) {
  const { t } = useTranslation();
  const { classroomsQuery } = useClassroomsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.classroom.updateStatus.mutationOptions({
      onSuccess: () => {
        classroomsQuery.refetch();
        toast.success(t('classrooms.updateStatusSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('classrooms.updateStatusError'));
      },
    })
  );

  function handleStatusChange(newStatus: ClassroomStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
      });
    }
  }

  const classroomStatuses = Object.values(ClassroomStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`classroomStatuses.${status}`)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {t('classrooms.students.enrollmentStatusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('classrooms.students.table.statusChangeWarning')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('classrooms.students.enrollmentStatusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`classroomStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('classrooms.students.enrollmentStatusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(value as ClassroomStatus)
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classroomStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(`classroomStatuses.${statusOption}`)}
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

interface ClassroomsDataTableRowActionsProps {
  row: Row<Classroom>;
}

export function ClassroomsDataTableRowActions({
  row,
}: ClassroomsDataTableRowActionsProps) {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useClassroomsContext();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={() => {
              navigate({
                to: '/classrooms/$classroomId',
                params: { classroomId: row.original.id },
                search: {} as any,
              });
              sessionStorage.setItem('previousUrl', window.location.pathname);
            }}
          >
            <Eye className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('classrooms.table.actions.view')}</TooltipContent>
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
            <Edit className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('classrooms.table.actions.edit')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0 hover:text-red-500"
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('delete');
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('classrooms.table.actions.delete')}</TooltipContent>
      </Tooltip>
    </div>
  );
}
