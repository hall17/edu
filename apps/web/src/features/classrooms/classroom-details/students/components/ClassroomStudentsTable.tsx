import { EnrollmentStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
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
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Eye, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { ClassroomStudentsDataTableToolbar } from './ClassroomStudentsDataTableToolbar';
import { ClassroomStudentsPrimaryButtons } from './ClassroomStudentsPrimaryButtons';

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
  TableLoading,
  TableNoResults,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ClassroomStudent, trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function ClassroomStudentsTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { studentsQuery, filters, setFilters } = useClassroomStudentsContext();
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
    data: studentsQuery.data?.students ?? [],
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
    rowCount: studentsQuery.data?.pagination.count,
  });

  return (
    <div className="space-y-4">
      <ClassroomStudentsDataTableToolbar table={table} />
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
            ) : studentsQuery.isLoading ? (
              <TableLoading colSpan={columns.length} />
            ) : (
              <TableNoResults
                colSpan={columns.length}
                text={t('students.table.noResults')}
              />
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

interface ClassroomStudentsStatusCellProps {
  row: Row<ClassroomStudent>;
}

function ClassroomStudentsStatusCell({
  row,
}: ClassroomStudentsStatusCellProps) {
  const { t } = useTranslation();
  const { studentsQuery, classroomId } = useClassroomStudentsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.classroom.updateStudentEnrollmentStatus.mutationOptions({
      onSuccess: () => {
        studentsQuery.refetch();
        toast.success(t('students.enrollmentStatusDialog.success'));
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  function handleStatusChange(newStatus: EnrollmentStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        classroomId,
        studentId: row.original.studentId,
        status: newStatus,
      });
    }
  }

  const enrollmentStatuses = Object.values(EnrollmentStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`enrollmentStatuses.${status}`)}
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
              {t(`enrollmentStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('students.enrollmentStatusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(value as EnrollmentStatus)
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {enrollmentStatuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(`enrollmentStatuses.${statusOption}`)}
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

export function useColumns(): ColumnDef<ClassroomStudent>[] {
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
      accessorFn: (row) => row.student.firstName,
      id: 'firstName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('students.table.firstName')}
        />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-48">
          {row.original.student.firstName}
        </LongText>
      ),
      meta: { className: 'w-48' },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.student.lastName,
      id: 'lastName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('students.table.lastName')}
        />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-48">
          {row.original.student.lastName}
        </LongText>
      ),
      meta: { className: 'w-48' },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.student.email,
      id: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('students.table.email')}
        />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-64">{row.original.student.email}</LongText>
      ),
      meta: { className: 'w-64' },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.student.nationalId,
      id: 'nationalId',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('students.table.nationalId')}
        />
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.student.nationalId || ''}
        </div>
      ),
      meta: { className: 'w-32' },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => <ClassroomStudentsStatusCell row={row} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'enrolledAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.enrolledAt')} />
      ),
      cell: ({ row }) => {
        return <div>{dayjs(row.original.enrolledAt).format('DD/MM/YYYY')}</div>;
      },
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      cell: ClassroomStudentsDataTableRowActions,
      enableHiding: false,
    },
  ];
}

interface ClassroomStudentsDataTableRowActionsProps {
  row: Row<ClassroomStudent>;
}

export function ClassroomStudentsDataTableRowActions({
  row,
}: ClassroomStudentsDataTableRowActionsProps) {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useClassroomStudentsContext();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('view');
            }}
          >
            <Eye className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('students.table.actions.view')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0 hover:text-blue-500"
            onClick={() => {
              setCurrentRow(row.original);
              setOpenedDialog('enrollmentStatus');
            }}
          >
            <Edit className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t('students.table.actions.changeStatus')}
        </TooltipContent>
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
            <Trash2 className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('students.table.actions.delete')}</TooltipContent>
      </Tooltip>
    </div>
  );
}
