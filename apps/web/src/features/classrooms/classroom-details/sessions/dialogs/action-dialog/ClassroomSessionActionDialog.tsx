import { AttendanceStatus } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { detailedDiff } from 'deep-object-diff';
import { Lock, LockOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomDetailsContext } from '../../../ClassroomDetailsContext';
import { useClassroomSessionsContext } from '../../ClassroomSessionsContext';

import { ClassroomSessionAttendanceRecordForm } from './ClassroomSessionAttendanceRecordForm';
import { ClassroomSessionInformationForm } from './ClassroomSessionInformationForm';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  ClassroomSessionFormProvider,
  useClassroomSessionForm,
} from '@/context/ClassroomSessionFormContext';
import {
  type ClassroomSessionFormData,
  classroomSessionFormInitialValues,
} from '@/lib/schemas/classroomSessionFormSchema';
import { trpc } from '@/lib/trpc';

export function ClassroomSessionActionDialog() {
  const { currentRow } = useClassroomSessionsContext();
  const { classroom } = useClassroomDetailsContext();

  return (
    <ClassroomSessionFormProvider classroom={classroom} session={currentRow}>
      <ClassroomSessionContent />
    </ClassroomSessionFormProvider>
  );
}

function ClassroomSessionContent() {
  const {
    openedDialog,
    setOpenedDialog,
    currentRow,
    classroomIntegrationSessionsQuery,
  } = useClassroomSessionsContext();
  const { classroom, classroomQuery } = useClassroomDetailsContext();
  const { form } = useClassroomSessionForm();
  const { t } = useTranslation();

  const isEdit = openedDialog === 'edit';
  const isCreate = openedDialog === 'create';

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const createMutation = useMutation(
    trpc.classroom.createIntegrationSession.mutationOptions({
      onSuccess: () => {
        classroomQuery.refetch();
        classroomIntegrationSessionsQuery.refetch();

        toast.success(t('sessions.createDialog.createSuccess'));
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(t('sessions.createDialog.createError'));
      },
    })
  );

  const updateMutation = useMutation(
    trpc.classroom.updateIntegrationSession.mutationOptions({
      onSuccess: () => {
        classroomQuery.refetch();
        classroomIntegrationSessionsQuery.refetch();
        toast.success(t('sessions.createDialog.updateSuccess'));
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(t('sessions.createDialog.updateError'));
      },
    })
  );

  // Populate form when editing
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        classroomIntegrationId: currentRow.classroomIntegrationId || '',
        description: currentRow.description || '',
        lessonIds:
          currentRow.lessons?.map((lesson: any) => lesson.lesson.id) || [],
        teacherId: currentRow.teacherId || '',
        startDate: currentRow.startDate,
        endDate: currentRow.endDate,
        attendanceRecords:
          currentRow.attendanceRecords?.map((record) => ({
            id: record.id,
            studentId: record.studentId,
            status: record.status,
            remarks: record.remarks || '',
          })) || [],
        isAttendanceRecordCompleted:
          currentRow.isAttendanceRecordCompleted || false,
      });
    } else {
      form.reset({
        ...classroomSessionFormInitialValues,
        startDate: currentRow?.startDate,
        endDate: currentRow?.endDate,
      });
    }
  }, [isEdit, isCreate, currentRow, form]);

  function onSubmit(data: ClassroomSessionFormData) {
    // Validate that attendance records count equals students count
    const attendanceRecordsWithoutStatus = data.attendanceRecords?.filter(
      (record) => record.status === 'none'
    );

    if (attendanceRecordsWithoutStatus?.length) {
      toast.error(t('common.allStudentsMustHaveAttendanceRecord'));
      return;
    }

    const recordsToSave = data.attendanceRecords?.map((record) => ({
      id: record.id,
      studentId: record.studentId,
      status: record.status as AttendanceStatus,
      remarks: record.remarks || '',
    }));

    const payload = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      attendanceRecords: recordsToSave,
    };

    if (isEdit && currentRow) {
      const diff = detailedDiff(form.formState.defaultValues ?? {}, data);

      if (
        !Object.keys(diff.updated).length &&
        !Object.keys(diff.deleted).length &&
        !Object.keys(diff.added).length
      ) {
        toast.error(t('sessions.createDialog.noChanges'));
        return;
      }

      updateMutation.mutate({
        ...payload,
        startDate: data.startDate,
        endDate: data.endDate,
        id: currentRow.id,
      });
    } else if (isCreate) {
      createMutation.mutate({
        ...payload,
        startDate: data.startDate,
        endDate: data.endDate,
      });
    }
  }

  function handleDialogClose(state: boolean) {
    let isDirty = false;

    if (form.formState.defaultValues) {
      const diff = detailedDiff(form.formState.defaultValues, form.getValues());
      isDirty =
        Object.keys(diff.updated).length > 0 ||
        Object.keys(diff.added).length > 0 ||
        Object.keys(diff.deleted).length > 0;
    }

    if (!state && isDirty) {
      // User is trying to close and form is dirty
      setShowConfirmDialog(true);
    } else {
      // Safe to close
      handleConfirmClose();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    setOpenedDialog(null);
    form.reset();
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  async function handleToggleAttendanceRecordCompletion() {
    const validRecords = currentRow.attendanceRecords?.filter(
      (record) => record.status !== ('none' as any)
    );

    if (validRecords?.length !== classroom?.students?.length) {
      toast.error(t('common.allStudentsMustHaveAttendanceRecord'));
      return;
    }

    updateMutation.mutate({
      id: currentRow.id,
      isAttendanceRecordCompleted: !currentRow.isAttendanceRecordCompleted,
    });
  }

  return (
    <>
      <Dialog open={isCreate || isEdit} onOpenChange={handleDialogClose}>
        <DialogContent className="min-w-[60vw]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('sessions.createDialog.editTitle')
                : t('sessions.createDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {isEdit && currentRow && (
                <>
                  {dayjs(currentRow.startDate).format('DD/MM/YYYY HH:mm')} -{' '}
                  {dayjs(currentRow.endDate).format('HH:mm')}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="session-form"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
              })}
              className="space-y-4"
            >
              <ClassroomSessionInformationForm />
              {isEdit && <ClassroomSessionAttendanceRecordForm />}
            </form>
          </Form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpenedDialog(null);
                form.reset();
              }}
            >
              {t('sessions.createDialog.cancel')}
            </Button>
            {isEdit && (
              <LoadingButton
                className="bg-blue-400"
                isLoading={updateMutation.isPending}
                onClick={handleToggleAttendanceRecordCompletion}
              >
                {currentRow?.isAttendanceRecordCompleted ? (
                  <>
                    <LockOpen />
                    {t('sessions.createDialog.incompleteAttendanceRecord')}
                  </>
                ) : (
                  <>
                    <Lock />
                    {t('sessions.createDialog.completeAttendanceRecord')}
                  </>
                )}
              </LoadingButton>
            )}
            <LoadingButton
              isLoading={createMutation.isPending || updateMutation.isPending}
              type="submit"
              form="session-form"
            >
              {isEdit
                ? t('sessions.createDialog.update')
                : t('sessions.createDialog.create')}
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UnsavedChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
