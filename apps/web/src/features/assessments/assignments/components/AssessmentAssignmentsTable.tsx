import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { LongText } from '@/components/LongText';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { useAssessmentAssignmentsContext } from '../AssessmentAssignmentsContext';

type ClassroomIntegrationAssessment = any;

export function AssessmentAssignmentsTable() {
  const { t } = useTranslation();
  const { assignmentsQuery } = useAssessmentAssignmentsContext();

  const columns = useColumns();

  const table = useReactTable({
    data: assignmentsQuery.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : header.column.columnDef.header?.toString()}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function useColumns(): ColumnDef<ClassroomIntegrationAssessment>[] {
  const { t } = useTranslation();

  return [
    {
      accessorKey: 'assessment.title',
      header: 'Assessment',
      cell: ({ row }) => {
        const title = row.original.assessment.title;
        return <LongText className="max-w-36">{title}</LongText>;
      },
    },
    {
      accessorKey: 'classroomIntegration.classroom.name',
      header: 'Classroom',
      cell: ({ row }) => {
        const classroomName = row.original.classroomIntegration.classroom.name;
        return <LongText className="max-w-36">{classroomName}</LongText>;
      },
    },
    {
      accessorKey: 'classroomIntegration.subject.name',
      header: 'Subject',
      cell: ({ row }) => {
        const subjectName = row.original.classroomIntegration.subject.name;
        return <LongText className="max-w-36">{subjectName}</LongText>;
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const startDate = row.getValue('startDate');
        return (
          <div className="text-nowrap">
            {new Date(startDate as Date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const endDate = row.getValue('endDate');
        return (
          <div className="text-nowrap">
            {new Date(endDate as Date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const startDate = new Date(row.original.startDate);
        const endDate = new Date(row.original.endDate);
        const now = new Date();

        let status: 'upcoming' | 'active' | 'completed';
        let variant: 'secondary' | 'default' | 'outline';

        if (now < startDate) {
          status = 'upcoming';
          variant = 'secondary';
        } else if (now >= startDate && now <= endDate) {
          status = 'active';
          variant = 'default';
        } else {
          status = 'completed';
          variant = 'outline';
        }

        return (
          <Badge variant={variant} className="capitalize">
            {t(`assessments.assignmentStatuses.${status}`)}
          </Badge>
        );
      },
    },
  ];
}
