import { detailedDiff } from 'deep-object-diff';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ClassroomFormProvider,
  useClassroomForm,
} from './ClassroomFormContext';
import { ClassroomActionStepper } from './components/ClassroomActionStepper';

import { UnsavedChangesDialog } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { defineStepper } from '@/components/ui/stepper';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import { parseHourAndMinutesUTC } from '@/utils/parseHourAndMinutesUTC';

const steps = ['basic', 'modules', 'integrations', 'calendar'] as const;
export type StepperStepId = (typeof steps)[number];

export const { Stepper, useStepper } = defineStepper(
  {
    id: 'basic',
  },
  {
    id: 'modules',
  },
  {
    id: 'integrations',
  },
  {
    id: 'calendar',
  }
);

function ClassroomsActionDialogContent() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useClassroomsContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    form,
    integrationFields,
    appendIntegration,
    resetFormToInitialValues,
    classroomImageFile,
    setClassroomImageFile,
  } = useClassroomForm();

  const isEdit = !!currentRow;

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
                teacherId: integration.teacherId || '',
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
                sessions: integration.classroomIntegrationSessions.map(
                  (session) => {
                    return {
                      ...session,
                      lessons:
                        session.lessons.map((lesson) => {
                          return {
                            id: lesson.lesson.id,
                            name: lesson.lesson.name,
                          };
                        }) || [],
                    };
                  }
                ),
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
      resetFormToInitialValues();
    }
  }, [isEdit, currentRow]);

  // Ensure there's always at least one integration
  useEffect(() => {
    if (currentRow?.integrations?.length === 0) {
      appendIntegration({
        id: crypto.randomUUID(),
        classroomId: currentRow?.id || '',
        subjectId: '',
        curriculumId: '',
        teacherId: '',
        schedules: [],
        sessions: [],
      });
    }
  }, [integrationFields.length, appendIntegration, currentRow?.id]);

  function handleDialogClose(state: boolean) {
    let isDirty = false;

    if (form.formState.defaultValues) {
      const diff = detailedDiff(form.formState.defaultValues, form.getValues());

      isDirty =
        Object.keys(diff.updated).length > 0 ||
        Object.keys(diff.added).length > 0 ||
        Object.keys(diff.deleted).length > 0;
    }

    if (!state && (isDirty || classroomImageFile)) {
      // User is trying to close and form is dirty or image file is selected
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
    setClassroomImageFile(null);
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
        <Stepper.Provider labelOrientation="vertical">
          <ClassroomActionStepper />
        </Stepper.Provider>
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

export function ClassroomsActionDialog() {
  return (
    <ClassroomFormProvider>
      <ClassroomsActionDialogContent />
    </ClassroomFormProvider>
  );
}
