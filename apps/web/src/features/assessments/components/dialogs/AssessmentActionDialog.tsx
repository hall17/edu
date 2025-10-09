import { ScheduleType, ScoringType } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAssessmentsContext } from '../../AssessmentsContext';

import { BasicTab } from './action-dialog/BasicTab';
import { QuestionsTab } from './action-dialog/QuestionsTab';

import { LoadingButton } from '@/components/LoadingButton';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';

// Form schema for assessment creation and editing
const assessmentFormSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  scheduleType: z.nativeEnum(ScheduleType),
  duration: z.number().int().positive().optional(),
  maxPoints: z.number().int().min(1).max(1000),
  isPublic: z.boolean(),
  scoringType: z.nativeEnum(ScoringType),
  coverImageUrl: z.string().optional(),
  sendNotifications: z.boolean(),
  notificationFrequency: z.number().int().positive().optional(),
  subjectId: z.string(),
  curriculumId: z.string().optional(),
  lessonId: z.string().optional(),
  questions: z
    .array(
      z.object({
        questionId: z.string(),
        order: z.number().int().min(1),
        points: z.number().int().min(1),
      })
    )
    .optional(),
});

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;

export function AssessmentActionDialog() {
  const { t } = useTranslation();
  const {
    createAssessment,
    updateAssessment,
    openedDialog,
    setOpenedDialog,
    currentRow,
  } = useAssessmentsContext();

  // Mutations
  const createMutation = useMutation(
    trpc.assessment.create.mutationOptions({
      onSuccess: (assessment) => {
        toast.success(t('assessments.actionDialog.success.create'));
        createAssessment({
          ...assessment,
          _count: { questions: 0, classroomIntegrationAssessments: 0 },
        });
        setOpenedDialog(null);
        form.reset();
      },
      onError: (error) => {
        console.error('Failed to create assessment:', error);
        toast.error(t('assessments.actionDialog.errors.create'));
      },
    })
  );

  const updateMutation = useMutation(
    trpc.assessment.update.mutationOptions({
      onSuccess: (assessment) => {
        toast.success(t('assessments.actionDialog.success.update'));
        updateAssessment({
          ...assessment,
          _count: { questions: 0, classroomIntegrationAssessments: 0 },
        });
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to update assessment:', error);
        toast.error(t('assessments.actionDialog.errors.update'));
      },
    })
  );

  // Form setup
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
      curriculumId: '',
      lessonId: '',
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
        curriculumId: currentRow.curriculumId || '',
        lessonId: currentRow.lessonId || '',
        questions: [], // We'll handle questions separately if needed
      });
    }
  }, [isEdit, currentRow, form]);

  const selectedSubjectId = form.watch('subjectId');
  const selectedCurriculumId = form.watch('curriculumId');

  // Form submission handlers
  function onSubmit(data: AssessmentFormData) {
    console.log(data);
    // Include selected questions in the form data
    const formData = {
      ...data,
      // questions: selectedQuestions.map((question, index) => ({
      //   questionId: question.id,
      //   order: index + 1,
      //   points: Math.floor(data.maxPoints / selectedQuestions.length) || 1,
      // })),
    };

    if (isEdit && currentRow) {
      updateMutation.mutate({
        id: currentRow.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="min-w-[80vw]">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">
                  {t('assessments.actionDialog.tabs.basic')}
                </TabsTrigger>
                <TabsTrigger value="questions">
                  {t('assessments.actionDialog.tabs.questions')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <BasicTab form={form} />
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                <QuestionsTab form={form} />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenedDialog(null)}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {isEdit ? t('common.update') : t('common.create')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
