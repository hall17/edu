import { EnrollmentStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { LoadingButton } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/lib/trpc';

export function ClassroomStudentsEnrollmentStatusDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow, studentsQuery } =
    useClassroomStudentsContext();
  const [selectedStatus, setSelectedStatus] = useState<EnrollmentStatus | null>(
    null
  );

  const open = openedDialog === 'enrollmentStatus';

  const updateStatusMutation = useMutation(
    trpc.classroom.updateStudentEnrollmentStatus.mutationOptions({
      onSuccess: () => {
        studentsQuery.refetch();
        toast.success(t('students.enrollmentStatusDialog.success'));
        setOpenedDialog(null);
        setSelectedStatus(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  function handleUpdateStatus() {
    if (currentRow && selectedStatus) {
      updateStatusMutation.mutate({
        classroomId: currentRow.classroomId,
        studentId: currentRow.studentId,
        status: selectedStatus,
      });
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOpenedDialog(null);
      setSelectedStatus(null);
    }
  }

  if (!currentRow) return null;

  const enrollmentStatuses = Object.values(EnrollmentStatus);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-80">
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
              {t(`enrollmentStatuses.${currentRow.status}`)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              {t('students.enrollmentStatusDialog.newStatus')}
            </p>
            <Select
              value={selectedStatus || currentRow.status}
              onValueChange={(value) =>
                setSelectedStatus(value as EnrollmentStatus)
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {enrollmentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`enrollmentStatuses.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {updateStatusMutation.isPending && (
            <div className="text-muted-foreground text-sm">Loading...</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            isLoading={updateStatusMutation.isPending}
            onClick={handleUpdateStatus}
            disabled={!selectedStatus || selectedStatus === currentRow.status}
          >
            {t('students.enrollmentStatusDialog.updateButton')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
