import { MODULE_CODES, ModuleCode } from '@edusama/common';
import { DayOfWeek } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { TFunction } from 'i18next';
import { HomeIcon, PuzzleIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { BasicTab } from './components/BasicTab';
import { IntegrationsTab } from './components/IntegrationsTab';
import { ModulesTab } from './components/ModulesTab';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import { trpc } from '@/lib/trpc';
import { parseHourAndMinutesUTC } from '@/utils/parseHourAndMinutesUTC';

function getFormSchema(t: TFunction) {
  return z
    .object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      capacity: z.number().int().min(1).max(1000),
      attendancePassPercentage: z.number().int().min(0).max(100),
      assessmentScorePass: z.number().int().min(0).max(100),
      assignmentScorePass: z.number().int().min(0).max(100),
      sendNotifications: z.boolean().optional(),
      attendanceThreshold: z.number().int().min(0).max(100).optional(),
      reminderFrequency: z.number().int().optional(),
      startDate: z.date(),
      endDate: z.date(),
      imageUrl: z.string().optional(),
      classroomTemplateId: z.string().uuid().optional(),
      moduleIds: z.array(z.number().int()).optional(),
      integrations: z
        .array(
          z.object({
            id: z.string().uuid().optional(),
            classroomId: z.uuid().optional(),
            subjectId: z.uuid(),
            curriculumId: z.uuid(),
            teacherId: z.uuid().optional().nullable(),
            accessLink: z.string().url().max(255).optional().or(z.literal('')),
            schedules: z
              .array(
                z.object({
                  dayOfWeek: z.nativeEnum(DayOfWeek),
                  startTime: z
                    .string()
                    .regex(
                      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                      'Invalid time format (HH:MM)'
                    ),
                  endTime: z
                    .string()
                    .regex(
                      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                      'Invalid time format (HH:MM)'
                    ),
                })
              )
              .optional(),
          })
        )
        .refine(
          (integrations) => {
            const subjectIds = integrations.map(
              (integration) => integration.subjectId
            );
            const uniqueSubjectIds = new Set(subjectIds);
            return subjectIds.length === uniqueSubjectIds.size;
          },
          {
            message: t(
              'classrooms.actionDialog.integrations.subjectAlreadySelected'
            ),
            path: ['integrations'],
          }
        ),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: t('common.endDateMustBeAfterStartDate'),
      path: ['endDate'],
    });
}

export type FormData = z.infer<ReturnType<typeof getFormSchema>>;
export type Schedule = NonNullable<
  FormData['integrations'][number]['schedules']
>[number];

const initialValues: FormData = {
  name: '',
  description: '',
  capacity: 30,
  attendancePassPercentage: 80,
  assessmentScorePass: 80,
  assignmentScorePass: 80,
  startDate: new Date(),
  endDate: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6); // Default to 6 months from now
    return date;
  })(),
  imageUrl: undefined,
  classroomTemplateId: undefined,
  moduleIds: [],
  integrations: [
    {
      classroomId: undefined,
      subjectId: '',
      curriculumId: '',
      teacherId: null,
      schedules: [],
      accessLink: '',
    },
  ],
};

export function ClassroomsActionDialog() {
  const { t } = useTranslation();
  const { currentRow, createClassroom, updateClassroom, setOpenedDialog } =
    useClassroomsContext();
  const [activeTab, setActiveTab] = useState('basic');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isEdit = !!currentRow;

  const templatesQuery = useQuery(
    trpc.classroomTemplate.findAll.queryOptions({ all: true })
  );

  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // defaultValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        name: currentRow?.name || '',
        description: currentRow?.description || '',
        capacity: currentRow?.capacity || 30,
        attendancePassPercentage: currentRow?.attendancePassPercentage || 80,
        assessmentScorePass: currentRow?.assessmentScorePass || 80,
        assignmentScorePass: currentRow?.assignmentScorePass || 80,
        startDate: currentRow?.startDate
          ? new Date(currentRow.startDate)
          : new Date(),
        endDate: currentRow?.endDate
          ? new Date(currentRow.endDate)
          : (() => {
              const date = new Date();
              date.setMonth(date.getMonth() + 6); // Default to 6 months from now
              return date;
            })(),
        imageUrl: currentRow?.imageUrl || undefined,
        classroomTemplateId: currentRow?.classroomTemplateId || undefined,
        sendNotifications: currentRow?.sendNotifications ?? undefined,
        attendanceThreshold: currentRow?.attendanceThreshold ?? undefined,
        reminderFrequency: currentRow?.reminderFrequency ?? undefined,
        moduleIds: currentRow?.modules?.map((m) => m.moduleId) || [],
        integrations: currentRow?.integrations?.length
          ? currentRow.integrations.map((integration) => {
              return {
                ...integration,
                accessLink: integration.accessLink || undefined,
                schedules: integration.schedules?.map((schedule) => {
                  const startTime = parseHourAndMinutesUTC(schedule.startTime);
                  const endTime = parseHourAndMinutesUTC(schedule.endTime);
                  return {
                    ...schedule,
                    startTime: startTime?.hours + ':' + startTime?.minutes,
                    endTime: endTime?.hours + ':' + endTime?.minutes,
                    accessLink: integration.accessLink || undefined,
                  };
                }),
              };
            })
          : [
              {
                classroomId: currentRow?.id || undefined,
                subjectId: '',
                curriculumId: '',
                teacherId: '',
                schedules: [],
                accessLink: '',
              },
            ],
      });
    } else {
      form.reset(initialValues);
    }
  }, [isEdit, currentRow]);

  const {
    fields: integrationFields,
    append: appendIntegration,
    remove: removeIntegration,
  } = useFieldArray({
    control: form.control,
    name: 'integrations',
  });

  // Ensure there's always at least one integration
  useEffect(() => {
    if (currentRow?.integrations?.length === 0) {
      appendIntegration({
        classroomId: currentRow?.id || '',
        subjectId: '',
        curriculumId: '',
        teacherId: undefined,
        schedules: [],
      });
    }
  }, [integrationFields.length, appendIntegration, currentRow?.id]);

  // Modified remove function to prevent removing the last integration
  function handleRemoveIntegration(index: number) {
    if (integrationFields.length > 1) {
      removeIntegration(index);
    }
  }

  const createMutation = useMutation(
    trpc.classroom.create.mutationOptions({
      onSuccess: (data) => {
        createClassroom(data);
        toast.success(t('classrooms.actionDialog.createSuccess'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        toast.error(t('classrooms.actionDialog.createError'));
        console.error('Create classroom error:', error);
      },
    })
  );

  const updateMutation = useMutation(
    trpc.classroom.update.mutationOptions({
      onSuccess: (data) => {
        updateClassroom(data);
        toast.success(t('classrooms.actionDialog.updateSuccess'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        toast.error(t('classrooms.actionDialog.updateError'));
        console.error('Update classroom error:', error);
      },
    })
  );

  const onSubmit = (data: FormData) => {
    if (isEdit && currentRow) {
      updateMutation.mutate({
        ...data,
        id: currentRow.id,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      });
    } else {
      createMutation.mutate({
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      });
    }
  };

  function handleSelectedClassroomTemplateChange(templateId: string) {
    if (!templateId) {
      form.setValue('classroomTemplateId', undefined);

      Object.entries(initialValues).forEach(([key, value]) => {
        form.setValue(key as keyof FormData, value, { shouldValidate: false });
      });

      return;
    }

    form.setValue('classroomTemplateId', templateId);

    const selectedTemplate = templatesQuery.data?.classroomTemplates?.find(
      (template) => template.id === templateId
    );

    if (selectedTemplate) {
      form.setValue('name', selectedTemplate.name);
      form.setValue('description', selectedTemplate.description || '');
      form.setValue('capacity', selectedTemplate.capacity);
      form.setValue(
        'attendancePassPercentage',
        selectedTemplate.attendancePassPercentage
      );
      form.setValue(
        'assessmentScorePass',
        selectedTemplate.assessmentScorePass
      );
      form.setValue(
        'assignmentScorePass',
        selectedTemplate.assignmentScorePass
      );
      form.setValue(
        'startDate',
        selectedTemplate.startDate
          ? new Date(selectedTemplate.startDate)
          : new Date()
      );
      form.setValue(
        'endDate',
        selectedTemplate.endDate
          ? new Date(selectedTemplate.endDate)
          : new Date()
      );
      form.setValue('imageUrl', selectedTemplate.imageUrl || undefined);
      form.setValue(
        'moduleIds',
        selectedTemplate.modules?.map((m: any) => m.moduleId) || []
      );
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
      form.reset();
      setOpenedDialog(null);
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    form.reset();
    setOpenedDialog(null);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  return (
    <Dialog open onOpenChange={handleDialogClose}>
      <DialogContent className="xs:max-w-[80%] max-h-[90vh] sm:max-w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('classrooms.actionDialog.editTitle')
              : t('classrooms.actionDialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('classrooms.actionDialog.editDescription')
              : t('classrooms.actionDialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="classrooms-action-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, () => {
              toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
            })}
            className="flex-1 space-y-6"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  <span className="xs:block hidden">
                    {t('classrooms.actionDialog.tabs.basic')}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="modules"
                  className="flex items-center gap-2"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span className="xs:block hidden">
                    {t('classrooms.actionDialog.tabs.modules')}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="flex items-center gap-2"
                >
                  <PuzzleIcon className="h-4 w-4" />
                  <span className="xs:block hidden">
                    {t('classrooms.actionDialog.tabs.integrations')}
                  </span>
                </TabsTrigger>
              </TabsList>

              <BasicTab
                form={form}
                templatesQuery={templatesQuery}
                handleSelectedClassroomTemplateChange={
                  handleSelectedClassroomTemplateChange
                }
              />

              <ModulesTab form={form} />

              <IntegrationsTab
                form={form}
                appendIntegration={appendIntegration}
                handleRemoveIntegration={handleRemoveIntegration}
              />
            </Tabs>
          </form>
        </Form>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogClose(false)}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <LoadingButton
            type="submit"
            form="classrooms-action-form"
            disabled={isLoading}
          >
            {isEdit ? t('common.saveChanges') : t('common.create')}
          </LoadingButton>
        </div>
      </DialogContent>

      <UnsavedChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </Dialog>
  );
}
