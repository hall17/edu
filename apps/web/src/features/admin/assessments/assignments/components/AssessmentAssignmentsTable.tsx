import { ClassroomIntegrationAssessmentStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef, ColumnFiltersState, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAssessmentAssignmentsContext } from '../AssessmentAssignmentsContext';

import { AssessmentAssignmentsDataTableToolbar } from './AssessmentAssignmentsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
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
import { ClassroomIntegrationAssessment, trpc } from '@/lib/trpc';

export function AssessmentAssignmentsTable() {
  const { assignmentsQuery, filters, setFilters } =
    useAssessmentAssignmentsContext();
  const columns = useColumns();

  const columnFiltersState: ColumnFiltersState = [];

  const data = assignmentsQuery.data?.data ?? [];

  return (
    <CustomTable
      data={data}
      rowCount={assignmentsQuery.data?.pagination?.total ?? 0}
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      columnFiltersState={columnFiltersState}
      onColumnFiltersChange={(columnFilters) => {
        setFilters({
          ...filters,
        });
      }}
      CustomToolbar={AssessmentAssignmentsDataTableToolbar}
    />
  );
}

function useColumns(): ColumnDef<ClassroomIntegrationAssessment>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useAssessmentAssignmentsContext();

  return [
    {
      accessorKey: 'assessment.title',
      header: t('assessments.assigned.table.headers.assessment'),
      cell: ({ row }) => {
        const title = row.original.assessment.title;
        return <LongText className="max-w-36">{title}</LongText>;
      },
    },
    {
      accessorKey: 'classroomIntegration.classroom.name',
      header: t('assessments.assigned.table.headers.classroom'),
      cell: ({ row }) => {
        const classroomName = row.original.classroomIntegration.classroom.name;
        return <LongText className="max-w-36">{classroomName}</LongText>;
      },
    },
    {
      accessorKey: 'classroomIntegration.subject.name',
      header: t('assessments.assigned.table.headers.subject'),
      cell: ({ row }) => {
        const subjectName = row.original.classroomIntegration.subject.name;
        return <LongText className="max-w-36">{subjectName}</LongText>;
      },
    },
    {
      accessorKey: 'startDate',
      header: t('assessments.assigned.table.headers.startDate'),
      cell: ({ row }) => {
        const startDate = row.original.startDate;
        return (
          <div className="text-nowrap">
            {format(new Date(startDate as Date), 'dd/MM/yyyy')}
          </div>
        );
      },
    },
    {
      accessorKey: 'endDate',
      header: t('assessments.assigned.table.headers.endDate'),
      cell: ({ row }) => {
        const endDate = row.getValue('endDate');
        return (
          <div className="text-nowrap">
            {format(new Date(endDate as Date), 'dd/MM/yyyy')}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('assessments.assigned.table.headers.status'),
      cell: ({ row }) => <AssessmentAssignmentStatusCell row={row} />,
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

interface AssessmentAssignmentStatusCellProps {
  row: Row<ClassroomIntegrationAssessment>;
}

function AssessmentAssignmentStatusCell({
  row,
}: AssessmentAssignmentStatusCellProps) {
  const { t } = useTranslation();
  const { assignmentsQuery, updateAssignmentStatus } =
    useAssessmentAssignmentsContext();
  const [open, setOpen] = useState(false);

  const status = row.original.status;

  const updateStatusMutation = useMutation(
    trpc.assessment.updateClassroomIntegrationAssessment.mutationOptions({
      onSuccess: (data) => {
        updateAssignmentStatus(row.original.id, data.status);
        assignmentsQuery.refetch();
        toast.success(t('assessments.assigned.statusUpdateSuccess'));
        setOpen(false);
      },
      onError: () => {
        toast.error(t('assessments.assigned.statusUpdateError'));
      },
    })
  );

  function handleStatusChange(newStatus: ClassroomIntegrationAssessmentStatus) {
    if (newStatus !== status) {
      updateStatusMutation.mutate({
        id: row.original.id,
        status: newStatus,
      });
    }
  }

  const statuses = Object.values(ClassroomIntegrationAssessmentStatus);

  function getStatusBadgeVariant(status: ClassroomIntegrationAssessmentStatus) {
    switch (status) {
      case ClassroomIntegrationAssessmentStatus.ACTIVE:
        return 'default';
      case ClassroomIntegrationAssessmentStatus.COMPLETED:
        return 'outline';
      case ClassroomIntegrationAssessmentStatus.SUSPENDED:
        return 'secondary';
      case ClassroomIntegrationAssessmentStatus.TERMINATED:
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge
            variant={getStatusBadgeVariant(status)}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
          >
            {t(`classroomIntegrationAssessmentStatuses.${status}`)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {t('assessments.assigned.statusDialog.title')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('assessments.assigned.statusDialog.description')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t('assessments.assigned.statusDialog.currentStatus')}
            </p>
            <div className="text-muted-foreground text-sm">
              {t(`classroomIntegrationAssessmentStatuses.${status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('assessments.assigned.statusDialog.newStatus')}
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(
                  value as ClassroomIntegrationAssessmentStatus
                )
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {t(
                      `classroomIntegrationAssessmentStatuses.${statusOption}`
                    )}
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
