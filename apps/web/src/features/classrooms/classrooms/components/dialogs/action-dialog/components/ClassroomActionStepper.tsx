import { useMutation } from '@tanstack/react-query';
import { eachDayOfInterval, format, set } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomForm } from '../ClassroomFormContext';
import { ClassroomFormData } from '../classroomFormSchema';
import { useStepper, Stepper, StepperStepId } from '../ClassroomsActionDialog';

import { BasicStep } from './BasicStep';
import { CalendarStep } from './calendar-step/CalendarStep';
import { IntegrationsStep } from './integrations-step/IntegrationsStep';
import { ModulesStep } from './ModulesStep';

import { LoadingButton } from '@/components';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import { ClassroomSessionFormData } from '@/lib/schemas/classroomSessionFormSchema';
import { trpc } from '@/lib/trpc';
import { parseHourAndMinutesUTC } from '@/utils';

export function ClassroomActionStepper() {
  const { t } = useTranslation();
  const { currentRow, createClassroom, updateClassroom, setOpenedDialog } =
    useClassroomsContext();
  const methods = useStepper();
  const { form, schemasById, updateIntegration } = useClassroomForm();
  const watchedIntegrations = form.watch('integrations');
  const isEdit = !!currentRow;

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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  function onSubmit(data: ClassroomFormData) {
    if (isEdit && currentRow) {
      // TODO: Implement update mutation
      // updateMutation.mutate({
      //   ...data,
      //   id: currentRow.id,
      //   startDate: data.startDate.toISOString(),
      //   endDate: data.endDate.toISOString(),
      //   description: data.description || '',
      // });
    } else {
      createMutation.mutate({
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        integrations: data.integrations.map((integration) => {
          return {
            id: integration.id,
            subjectId: integration.subjectId,
            curriculumId: integration.curriculumId,
            teacherId: integration.teacherId,
            schedules: integration.schedules,
            accessLink: integration.accessLink,
            sessions: integration.sessions?.map((session) => {
              return {
                id: session.id,
                startDate: session.startDate,
                endDate: session.endDate,
                description: session.description || '',
                teacherId: session.teacherId,
                lessonIds: session.lessonIds,
              };
            }),
          };
        }),
      });
    }
  }

  async function goToStep(stepId: StepperStepId) {
    const currentStepIndex = methods.all.findIndex(
      (s) => s.id === methods.current.id
    );
    const stepIndex = methods.all.findIndex((s) => s.id === stepId);

    if (currentStepIndex < stepIndex) {
      const schema =
        schemasById[methods.current.id as keyof typeof schemasById];
      const schemaParsed = await schema.safeParseAsync(form.getValues());

      if (!schemaParsed.success) {
        toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
        schemaParsed.error.issues.forEach((issue) => {
          form.setError(issue.path.join('.') as keyof ClassroomFormData, {
            message: issue.message,
          });
        });
        return false;
      }
    }

    if (methods.current.id === 'integrations') {
      handleCreateSessions();
    }

    methods.goTo(stepId);
  }

  function handleCreateSessions() {
    // update the sessions with the new schedules
    // find all same days of week within start and end date of the classroom and create a session for each day by schedule
    const startDate = form.getValues('startDate');
    const endDate = form.getValues('endDate');

    const allDaysWithinRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    watchedIntegrations.forEach((integration, index) => {
      const sessions: ClassroomSessionFormData[] = [];
      const schedules = integration.schedules ?? [];

      schedules.forEach((schedule) => {
        const startTime = parseHourAndMinutesUTC(schedule.startTime);
        const endTime = parseHourAndMinutesUTC(schedule.endTime);

        const allRecurringDays = allDaysWithinRange.filter((day) => {
          const dayOfWeek = format(day, 'EEEE');
          return dayOfWeek.toLowerCase() === schedule.dayOfWeek.toLowerCase();
        });

        allRecurringDays.forEach((day) => {
          // set hour and minutes from schedule.startTime and schedule.endTime
          const startDate = set(day, {
            hours: Number(startTime?.hours ?? 0),
            minutes: Number(startTime?.minutes ?? 0),
            seconds: 0,
            milliseconds: 0,
          });

          const endDate = set(day, {
            hours: Number(endTime?.hours ?? 0),
            minutes: Number(endTime?.minutes ?? 0),
            seconds: 0,
            milliseconds: 0,
          });

          const session: ClassroomSessionFormData = {
            id: crypto.randomUUID(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            classroomIntegrationId: integration.id,
            teacherId: integration.teacherId,
            lessonIds: [],
          };

          sessions.push(session);
        });
      });

      updateIntegration(index, {
        ...integration,
        sessions,
      });
    });
  }

  return (
    <Form {...form}>
      <form
        id="classrooms-action-form"
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => {
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
              <Stepper.Title>
                {t(`classrooms.actionDialog.steps.${step.id}`)}
              </Stepper.Title>
            </Stepper.Step>
          ))}
        </Stepper.Navigation>
        {methods.switch({
          basic: () => <BasicStep />,
          modules: () => <ModulesStep />,
          integrations: () => <IntegrationsStep />,
          calendar: () => <CalendarStep />,
        })}
        <Stepper.Controls>
          {!methods.isFirst && (
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
                    toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
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
  );
}
