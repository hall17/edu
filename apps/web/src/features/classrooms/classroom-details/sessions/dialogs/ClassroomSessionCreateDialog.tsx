import { AttendanceStatus } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { detailedDiff } from 'deep-object-diff';
import { Lock, LockOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useClassroomDetailsContext } from '../../ClassroomDetailsContext';
import { useClassroomSessionsContext } from '../ClassroomSessionsContext';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
import { DateTimePicker24h } from '@/components/DateTimePicker24h';
import { MultiSelect } from '@/components/MultiSelect';
import { Badge } from '@/components/ui/badge';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { trpc } from '@/lib/trpc';
import { getAttendanceRecordStatusBadgeColor } from '@/utils';

const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().max(500).optional(),
});

export function ClassroomSessionCreateDialog() {
  const {
    openedDialog,
    setOpenedDialog,
    currentRow,
    classroomIntegrationSessionsQuery,
  } = useClassroomSessionsContext();
  const { classroom, classroomQuery } = useClassroomDetailsContext();
  const { t } = useTranslation();

  const isEdit = openedDialog === 'edit';
  const isCreate = openedDialog === 'create';

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const studentsSorted = useMemo(() => {
    return classroom?.students.sort((a, b) => {
      // First sort by firstName
      const firstNameComparison = a.student.firstName.localeCompare(
        b.student.firstName
      );
      if (firstNameComparison !== 0) {
        return firstNameComparison;
      }
      // If firstNames are equal, sort by lastName
      return a.student.lastName.localeCompare(b.student.lastName);
    });
  }, [classroom?.students]);

  const formSchema = z
    .object({
      classroomIntegrationId: z.string(),
      description: z.string().optional(),
      lessonIds: z.array(z.string()).optional(),
      teacherId: z.string().optional(),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      attendanceRecords: z.array(
        attendanceRecordSchema.extend({
          status: z.nativeEnum(AttendanceStatus).or(z.literal('none')),
        })
      ),
      isAttendanceRecordCompleted: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          const startDate = dayjs(data.startDate);
          const endDate = dayjs(data.endDate);

          // Check if both dates are on the same day
          const isSameDay = startDate.isSame(endDate, 'day');

          if (!isSameDay) {
            return false;
          }

          // If same day, check if end time is after start time
          return startDate.isBefore(endDate);
        }
        return true;
      },
      {
        path: ['startDate', 'endDate'],
        message: t('common.sessionMustBeOnSameDay'),
      }
    );

  type FormData = z.infer<typeof formSchema>;

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

  // const completeAttendanceRecordMutation = useMutation(
  //   trpc.classroom.updateIntegrationSession.mutationOptions({
  //     onSuccess: () => {
  //       toast.success(t('sessions.createDialog.completeAttendanceRecordSuccess'));
  //     },
  //   })
  // );

  const defaultValues: FormData = {
    classroomIntegrationId: '',
    description: '',
    lessonIds: [],
    teacherId: '',
    startDate: '',
    endDate: '',
    attendanceRecords: [],
    isAttendanceRecordCompleted: false,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const watchedAttendanceRecords = form.watch('attendanceRecords');
  const watchedClassroomIntegrationId = form.watch('classroomIntegrationId');

  const selectedClassroomIntegration = useMemo(() => {
    return classroom?.integrations?.find(
      (integration) => integration.id === watchedClassroomIntegrationId
    );
  }, [watchedClassroomIntegrationId, classroom?.integrations]);

  const isAllSelected = studentsSorted
    ? watchedAttendanceRecords?.length === studentsSorted.length
    : false;

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
    } else if (isCreate) {
      form.reset(defaultValues);
    }
  }, [isEdit, isCreate, currentRow, form]);

  function handleSetAllStudentsPresent() {
    form.setValue(
      'attendanceRecords',
      studentsSorted?.map(({ student }) => {
        const existingRecord = currentRow?.attendanceRecords?.find(
          (r) => r.studentId === student.id
        );
        return {
          ...(existingRecord ?? {}),
          studentId: student.id,
          status: AttendanceStatus.PRESENT,
          remarks: existingRecord?.remarks ?? '',
        };
      }) || []
    );
  }

  function onSubmit(data: FormData) {
    if (!classroom) return;

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

  return (
    <>
      <Dialog open={isCreate || isEdit} onOpenChange={handleDialogClose}>
        <DialogContent className="min-w-[80vw]">
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">
                  {t('sessions.createDialog.sessionInformation')}
                </h4>
                <div className="grid grid-cols-2 items-start gap-4">
                  <FormField
                    control={form.control}
                    name="classroomIntegrationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('sessions.createDialog.classroomIntegrationLabel')}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  'sessions.createDialog.classroomIntegrationPlaceholder'
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classroom?.integrations?.map((integration) => (
                              <SelectItem
                                key={integration.id}
                                value={integration.id}
                              >
                                {integration.subject?.name} -{' '}
                                {integration.curriculum?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('sessions.createDialog.teacherLabel')}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  'sessions.createDialog.teacherPlaceholder'
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedClassroomIntegration?.subject?.teachers.map(
                              ({ teacher }) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.firstName} {teacher.lastName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lessonIds"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            {t('sessions.createDialog.lessonLabel')}
                          </FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={
                                selectedClassroomIntegration?.curriculum?.lessons.map(
                                  (lesson) => ({
                                    label: lesson.name,
                                    value: lesson.id,
                                  })
                                ) || []
                              }
                              defaultValue={field.value || []}
                              onValueChange={field.onChange}
                              placeholder={t(
                                'sessions.createDialog.lessonPlaceholder'
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('sessions.createDialog.descriptionLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t(
                              'sessions.createDialog.descriptionPlaceholder'
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('sessions.createDialog.startDateLabel')}
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker24h
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(date) =>
                              field.onChange(date?.toISOString())
                            }
                            placeholder={t(
                              'sessions.createDialog.startDatePlaceholder'
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('sessions.createDialog.endDateLabel')}
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker24h
                            placeholder={t(
                              'sessions.createDialog.endDatePlaceholder'
                            )}
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(date) =>
                              field.onChange(date?.toISOString())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isEdit && (
                <div className="rounded-lg border">
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {t(
                            'classrooms.sessions.editDialog.editStudentAttendance'
                          )}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {t(
                            'classrooms.sessions.editDialog.selectStudentsDescription'
                          )}
                        </p>
                      </div>
                      {!currentRow?.isAttendanceRecordCompleted && (
                        <div className="flex items-center justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetAllStudentsPresent()}
                          >
                            {t('classrooms.sessions.editDialog.setAllPresent')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {t(
                              'classrooms.sessions.editDialog.tableHeaders.studentName'
                            )}
                          </TableHead>
                          <TableHead>
                            {t(
                              'classrooms.sessions.editDialog.tableHeaders.status'
                            )}
                          </TableHead>
                          <TableHead>
                            {t(
                              'classrooms.sessions.editDialog.tableHeaders.remarks'
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!studentsSorted || studentsSorted.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-muted-foreground text-center"
                            >
                              {t(
                                'classrooms.sessions.editDialog.noStudentsEnrolled'
                              )}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {studentsSorted.map(({ student }) => {
                              const existingRecord =
                                currentRow?.attendanceRecords?.find(
                                  (r: any) => r.studentId === student.id
                                );

                              const existingFormRecord =
                                watchedAttendanceRecords?.find(
                                  (r) => r.studentId === student.id
                                );

                              const index = watchedAttendanceRecords?.findIndex(
                                (r) => r.studentId === student.id
                              );

                              const status =
                                existingFormRecord?.status ??
                                existingRecord?.status ??
                                'none';

                              return (
                                <TableRow key={student.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <p className="font-medium">
                                            {student.firstName}{' '}
                                            {student.lastName}
                                          </p>
                                          <Badge
                                            className="text-xs"
                                            variant={
                                              existingRecord?.status
                                                ? getAttendanceRecordStatusBadgeColor(
                                                    existingRecord.status
                                                  )
                                                : 'outline'
                                            }
                                          >
                                            {existingRecord?.status
                                              ? t(
                                                  `attendanceStatuses.${existingRecord.status}` as any
                                                )
                                              : t('common.noRecord')}
                                          </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                          {student.email}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={status}
                                      onValueChange={(val) => {
                                        const existingAttendanceRecordIndex =
                                          watchedAttendanceRecords?.findIndex(
                                            (r) => r.studentId === student.id
                                          );

                                        if (
                                          existingAttendanceRecordIndex !== -1
                                        ) {
                                          form.setValue(
                                            `attendanceRecords.${index}.status`,
                                            val as AttendanceStatus
                                          );
                                        } else {
                                          form.setValue(`attendanceRecords`, [
                                            ...(watchedAttendanceRecords ?? []),
                                            {
                                              status: val as AttendanceStatus,
                                              studentId: student.id,
                                              remarks: '',
                                            },
                                          ]);
                                        }
                                      }}
                                      disabled={
                                        currentRow?.isAttendanceRecordCompleted
                                      }
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">
                                          {t('common.noRecord')}
                                        </SelectItem>
                                        {Object.values(AttendanceStatus).map(
                                          (status) => (
                                            <SelectItem
                                              key={status}
                                              value={status}
                                            >
                                              {t(
                                                `attendanceStatuses.${status}` as any
                                              )}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      value={existingFormRecord?.remarks ?? ''}
                                      onChange={(e) => {
                                        form.setValue(
                                          `attendanceRecords.${index}.remarks`,
                                          e.target.value
                                        );
                                      }}
                                      disabled={
                                        currentRow?.isAttendanceRecordCompleted
                                      }
                                      placeholder={t(
                                        'classrooms.sessions.editDialog.remarks'
                                      )}
                                      className="w-full"
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
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
                onClick={() => {
                  if (
                    watchedAttendanceRecords?.length !== studentsSorted?.length
                  ) {
                    toast.error(
                      t('common.allStudentsMustHaveAttendanceRecord')
                    );
                    return;
                  }

                  updateMutation.mutate({
                    id: currentRow.id,
                    isAttendanceRecordCompleted:
                      !currentRow.isAttendanceRecordCompleted,
                  });
                }}
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
