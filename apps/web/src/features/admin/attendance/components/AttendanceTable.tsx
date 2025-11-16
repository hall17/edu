import { useNavigate } from '@tanstack/react-router';
import { ColumnFiltersState } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAttendanceContext } from '../AttendanceContext';

import { AttendanceDataTableToolbar } from './AttendanceDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
import { Badge } from '@/components/ui/badge';
import { ClassroomIntegration } from '@/lib/trpc';

export function AttendanceTable() {
  const { t } = useTranslation();

  const { attendanceQuery, filters, setFilters } = useAttendanceContext();
  const columns = useColumns();

  const columnFiltersState: ColumnFiltersState = [];

  return (
    <CustomTable
      data={attendanceQuery.data?.classroomIntegrations ?? []}
      rowCount={attendanceQuery.data?.pagination?.count ?? 0}
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
      CustomToolbar={AttendanceDataTableToolbar}
    />
  );
}

function useColumns(): ColumnDef<ClassroomIntegration>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return [
    SelectItemColumnDef as ColumnDef<ClassroomIntegration>,
    {
      accessorKey: 'classroom.name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('attendance.table.classroom')}
        />
      ),
      cell: ({ row }) => {
        const classroomName = row.original.classroom.name;
        return <LongText className="max-w-36">{classroomName}</LongText>;
      },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorKey: 'subject.name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('attendance.table.subject')}
        />
      ),
      cell: ({ row }) => {
        const subjectName = row.original.subject.name;
        return <LongText className="max-w-32">{subjectName}</LongText>;
      },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorKey: 'curriculum.name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('attendance.table.curriculum')}
        />
      ),
      cell: ({ row }) => {
        const curriculumName = row.original.curriculum.name;
        return <LongText className="max-w-32">{curriculumName}</LongText>;
      },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      id: 'teacher',
      accessorFn: (row) => {
        if (!row.teacher) return '-';
        const { firstName, lastName } = row.teacher;
        return `${firstName} ${lastName}`;
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('attendance.table.teacher')}
        />
      ),
      cell: ({ row }) => {
        const teacher = row.original.teacher;
        if (!teacher) {
          return (
            <LongText className="text-muted-foreground max-w-36">-</LongText>
          );
        }
        const { firstName, lastName } = teacher;
        const fullName = `${firstName} ${lastName}`;
        return <LongText className="max-w-36">{fullName}</LongText>;
      },
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      accessorKey: 'classroom._count.students',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('attendance.table.studentsCount')}
        />
      ),
      cell: ({ row }) => {
        const studentsCount = row.original.classroom._count.students;
        return (
          <Badge variant="secondary" className="font-mono">
            {studentsCount}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'classroom.classroomIntegrationSessions.length',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('attendance.table.classroomIntegrationSessionsCount')}
        />
      ),
      cell: ({ row }) => {
        const classroomIntegrationSessionsCount =
          row.original.classroomIntegrationSessions.length;
        return (
          <Badge variant="secondary" className="font-mono">
            {classroomIntegrationSessionsCount}
          </Badge>
        );
      },
      enableSorting: true,
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
        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <Eye className="size-4" />,
                onClick: () => {
                  navigate({
                    to: '/classrooms/$classroomId/calendar',
                    params: { classroomId: row.original.classroom.id },
                    search: { subjectIds: [row.original.subject.id] } as any,
                    from: '/attendance',
                  });
                  sessionStorage.setItem(
                    'previousUrl',
                    window.location.pathname
                  );
                },
                tooltip: t('common.view'),
              },
            ]}
          />
        );
      },
    },
  ];
}
