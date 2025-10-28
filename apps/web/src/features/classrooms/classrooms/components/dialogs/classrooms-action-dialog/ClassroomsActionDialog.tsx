import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { BasicStep } from './components/BasicStep';
import { IntegrationsTab } from './components/IntegrationsTab';
import { ModulesTab } from './components/ModulesTab';
import { FormData, getFormSchema } from './getFormSchema';

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
import { defineStepper } from '@/components/ui/stepper';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import i18n from '@/lib/i18n';
import { trpc } from '@/lib/trpc';
import { parseHourAndMinutesUTC } from '@/utils/parseHourAndMinutesUTC';

export type Schedule = NonNullable<
  FormData['integrations'][number]['schedules']
>[number];

export const initialValues: FormData = {
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

type StepperStepId = 'basic' | 'modules' | 'integrations';

const { Stepper, useStepper } = defineStepper(
  {
    id: 'basic',
    title: i18n.t('classrooms.actionDialog.tabs.basic'),
    Component: BasicStep,
  },
  {
    id: 'modules',
    title: i18n.t('classrooms.actionDialog.tabs.modules'),
    Component: ModulesTab,
  },
  {
    id: 'integrations',
    title: i18n.t('classrooms.actionDialog.tabs.integrations'),
    Component: IntegrationsTab,
  }
);

export function ClassroomsActionDialog() {
  const { t } = useTranslation();
  const { currentRow, createClassroom, updateClassroom, setOpenedDialog } =
    useClassroomsContext();
  const [activeTab, setActiveTab] = useState('basic');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isEdit = !!currentRow;

  const schemasById = useMemo(() => {
    const { schema, basicSchema, modulesSchema, integrationsSchema } =
      getFormSchema(t);
    return {
      schema: schema,
      basic: basicSchema,
      modules: modulesSchema,
      integrations: integrationsSchema,
    };
  }, [t]);

  const formSchema = schemasById.schema;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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

  const methods = useStepper();

  console.log('methods', methods);

  async function goToStep(stepId: StepperStepId) {
    const currentStepIndex = methods.all.findIndex(
      (s) => s.id === methods.current.id
    );
    const stepIndex = methods.all.findIndex((s) => s.id === stepId);

    if (currentStepIndex < stepIndex) {
      const schema =
        schemasById[methods.current.id as keyof typeof schemasById];
      const schemaParsed = await schema.safeParseAsync(form.getValues());
      console.log('schemaParsed', schemaParsed);
      if (!schemaParsed.success) {
        toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
        schemaParsed.error.issues.forEach((issue) => {
          form.setError(issue.path[0] as keyof FormData, {
            message: issue.message,
          });
        });
        return false;
      }
    }

    methods.goTo(stepId);
  }

  return (
    <Dialog open onOpenChange={handleDialogClose}>
      <Stepper.Provider labelOrientation="vertical">
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
              onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.log('err', err);
                toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
              })}
              className="flex-1 space-y-6"
            >
              <Stepper.Navigation>
                {methods.all.map((step) => (
                  <Stepper.Step
                    key={step.id}
                    of={step.id}
                    type="button"
                    onClick={() => {
                      goToStep(step.id as StepperStepId);
                    }}
                  >
                    <Stepper.Title>{step.title}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>
              {methods.switch({
                basic: ({ Component }) => <Component form={form} />,
                modules: ({ Component }) => <Component form={form} />,
                integrations: ({ Component }) => (
                  <Component
                    form={form}
                    appendIntegration={appendIntegration}
                    handleRemoveIntegration={handleRemoveIntegration}
                  />
                ),
              })}
              <Stepper.Controls>
                {!methods.isLast && !methods.isFirst && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={methods.prev}
                    disabled={methods.isFirst}
                  >
                    {t('common.previous')}
                  </Button>
                )}
                {!methods.isLast && (
                  <Button
                    type="button"
                    onClick={async () => {
                      if (methods.isLast) {
                        // validate from before submit
                        const valid = await form.trigger();
                        if (!valid) {
                          toast.error(
                            t('common.pleaseEnsureAllFieldsAreValid')
                          );
                          return false;
                        }
                      }
                      const currentStepIndex = methods.all.findIndex(
                        (s) => s.id === methods.current.id
                      );
                      const nextStep = methods.all[currentStepIndex + 1];
                      goToStep(nextStep.id as StepperStepId);
                    }}
                  >
                    {t('common.next')}
                  </Button>
                )}
                {(isEdit || methods.isLast) && (
                  <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    form="classrooms-action-form"
                  >
                    {isEdit ? t('common.saveChanges') : t('common.create')}
                  </LoadingButton>
                )}
              </Stepper.Controls>
            </form>
          </Form>
        </DialogContent>

        <UnsavedChangesDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      </Stepper.Provider>
    </Dialog>
  );
}
