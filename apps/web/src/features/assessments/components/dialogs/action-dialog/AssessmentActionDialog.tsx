import {
  QuestionDifficulty,
  QuestionType,
  ScheduleType,
  ScoringType,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useAssessmentsContext } from '../../../AssessmentsContext';

import { AssessmentActionStepper } from './AssessmentActionStepper';

import { UnsavedChangesDialog } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { defineStepper } from '@/components/ui/stepper';

const steps = ['basic', 'questions'] as const;
export type StepperStepId = (typeof steps)[number];

export const { Stepper, useStepper } = defineStepper(
  {
    id: 'basic',
  },
  {
    id: 'questions',
  }
);

// Form schema for assessment creation and editing
export const basicAssessmentFormSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  scheduleType: z.nativeEnum(ScheduleType),
  duration: z.number().int().positive().optional(),
  maxPoints: z.number().int().min(1).max(100),
  isPublic: z.boolean(),
  scoringType: z.nativeEnum(ScoringType),
  coverImageUrl: z.string().optional(),
  sendNotifications: z.boolean(),
  notificationFrequency: z.number().int().positive().optional(),
  subjectId: z.uuid().min(1),
  curriculumIds: z.array(z.uuid()).optional(),
  lessonIds: z.array(z.uuid()).optional(),
});

export const questionsAssessmentFormSchema = z.object({
  questions: z
    .array(
      z.object({
        questionId: z.string(),
        order: z.number().int().min(1),
        points: z.number().int().min(1),
        question: z.object({
          id: z.string(),
          questionText: z.string(),
          type: z.nativeEnum(QuestionType),
          difficulty: z.nativeEnum(QuestionDifficulty),
        }),
      })
    )
    .optional(),
});

const assessmentFormSchema = basicAssessmentFormSchema.merge(
  questionsAssessmentFormSchema
);

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;

export function AssessmentActionDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useAssessmentsContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isEdit = !!currentRow;

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      scheduleType: ScheduleType.FLEXIBLE,
      duration: undefined,
      maxPoints: 100,
      isPublic: false,
      scoringType: ScoringType.MANUAL,
      coverImageUrl: '',
      sendNotifications: false,
      notificationFrequency: undefined,
      subjectId: '',
      curriculumIds: [],
      lessonIds: [],
      questions: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        title: currentRow.title || '',
        description: currentRow.description || '',
        scheduleType: currentRow.scheduleType,
        duration: currentRow.duration || undefined,
        maxPoints: currentRow.maxPoints,
        isPublic: currentRow.isPublic,
        scoringType: currentRow.scoringType,
        coverImageUrl: currentRow.coverImageUrl || '',
        sendNotifications: currentRow.sendNotifications,
        notificationFrequency: currentRow.notificationFrequency || undefined,
        subjectId: currentRow.subjectId || '',
        curriculumIds:
          currentRow.curriculums?.map(
            (curriculum) => curriculum.curriculumId
          ) || [],
        lessonIds: currentRow.lessons?.map((lesson) => lesson.lessonId) || [],
        questions: [],
      });
    }
  }, [isEdit, currentRow, form]);

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
      setShowConfirmDialog(true);
    } else {
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
    <>
      <Dialog open onOpenChange={handleDialogClose}>
        <DialogContent className="xs:max-w-[80%] max-h-[90vh] sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('assessments.actionDialog.editTitle')
                : t('assessments.actionDialog.addTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t('assessments.actionDialog.editDescription')
                : t('assessments.actionDialog.addDescription')}
            </DialogDescription>
          </DialogHeader>
          <Stepper.Provider labelOrientation="vertical">
            <AssessmentActionStepper form={form} />
          </Stepper.Provider>
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
