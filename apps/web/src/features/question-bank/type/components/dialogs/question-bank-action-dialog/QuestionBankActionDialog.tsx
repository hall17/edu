import {
  getQuestionDataSchema,
  type MultipleChoiceQuestionData,
  type OrderingQuestionData,
  QuestionData,
  questionDataSchema,
} from '@edusama/common';
import { QuestionDifficulty, QuestionType } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { UseFormReturn } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import z from 'zod';

import { useQuestionBankContext } from '../../../QuestionBankContext';

import { QuestionTypeFields } from './components/QuestionTypeFields';

import { LoadingButton } from '@/components';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Question, trpc } from '@/lib/trpc';

function splitTextIntoWords(text: string) {
  return text.split(/\s+/).filter((word) => word.length > 0);
}

const questionBankActionDialogSchema = z.object({
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(QuestionDifficulty),
  questionText: z.string().min(1),
  subjectId: z.uuid(),
  curriculumId: z.uuid().optional(),
  lessonId: z.uuid().optional(),
  questionData: questionDataSchema,
});
export type FormData = z.infer<typeof questionBankActionDialogSchema>;

// Helper function to create default questionData based on type
function getDefaultQuestionData(type: QuestionType): QuestionData {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return {
        options: ['', '', '', ''],
        correctAnswers: [],
        multipleChoiceType: 'SINGLE_ANSWER',
      };
    case QuestionType.TRUE_FALSE:
      return {
        correctAnswers: [],
      };
    case QuestionType.SHORT_ANSWER:
    case QuestionType.ESSAY:
      return {
        correctAnswers: [],
      };
    case QuestionType.FILL_IN_BLANK:
      return {
        correctAnswers: [],
      };
    case QuestionType.MATCHING:
      return {
        pairs: {
          leftColumn: [''],
          rightColumn: [''],
        },
        correctAnswers: {},
      };
    case QuestionType.ORDERING:
      return {
        options: [],
        correctAnswers: [],
      };
    default:
      return getDefaultQuestionData(QuestionType.MULTIPLE_CHOICE);
  }
}

export function QuestionBankActionDialog() {
  const { type } = useParams({
    from: '/_authenticated/question-bank/type/$type',
  });
  const { t } = useTranslation();
  const {
    currentRow,
    setOpenedDialog,
    createQuestion,
    updateQuestion,
    subjectsQuery,
  } = useQuestionBankContext();

  const createQuestionMutation = useMutation(
    trpc.question.create.mutationOptions()
  );
  const updateQuestionMutation = useMutation(
    trpc.question.update.mutationOptions()
  );

  const isEdit = !!currentRow;

  const defaultValues = isEdit
    ? {
        type: currentRow?.type ?? (type.toUpperCase() as QuestionType),
        difficulty: currentRow?.difficulty ?? QuestionDifficulty.MEDIUM,
        questionText: currentRow?.questionText ?? '',
        subjectId: currentRow?.subjectId ?? '',
        curriculumId: currentRow?.curriculumId ?? undefined,
        lessonId: currentRow?.lesson?.id ?? undefined,
        questionData:
          currentRow?.questionData ??
          getDefaultQuestionData(QuestionType.MULTIPLE_CHOICE),
      }
    : {
        type: type.toUpperCase() as QuestionType,
        difficulty: QuestionDifficulty.MEDIUM,
        questionText: '',
        subjectId: '',
        curriculumId: undefined,
        lessonId: undefined,
        questionData: getDefaultQuestionData(QuestionType.MULTIPLE_CHOICE),
      };

  const form = useForm<FormData>({
    resolver: zodResolver(questionBankActionDialogSchema),
    defaultValues,
    mode: 'onChange',
  });

  const watchedValues = useWatch({
    control: form.control,
    name: ['type', 'subjectId', 'curriculumId', 'questionData'] as const,
  });
  const selectedType = watchedValues[0];
  const selectedSubjectId = watchedValues[1];
  const selectedCurriculumId = watchedValues[2];
  const watchedQuestionData = watchedValues[3];
  const watchedOptionFields =
    'options' in watchedQuestionData ? watchedQuestionData.options : [];

  // Get selected subject
  const selectedSubject = subjectsQuery.data?.subjects?.find(
    (subject) => subject.id === selectedSubjectId
  );

  // Get available curriculums for selected subject
  const availableCurriculums = selectedSubject?.curriculums || [];

  // Get available lessons for selected curriculum
  const selectedCurriculum = availableCurriculums.find(
    (curriculum) => curriculum.id === selectedCurriculumId
  );

  const availableLessons = selectedCurriculum?.lessons || [];

  async function onSubmit(values: FormData) {
    try {
      // The questionData is already properly structured, just validate it
      const validatedQuestionData = getQuestionDataSchema(
        values.type
      ).safeParse(watchedQuestionData);

      if (validatedQuestionData.error) {
        validatedQuestionData.error.issues.forEach((issue) => {
          form.setError(`questionData.${issue.path.join('.')}` as any, {
            message: issue.message,
          });
        });
        toast.error(t('common.pleaseFillInAllRequiredFields'));
      }

      const submissionData = {
        type: values.type,
        difficulty: values.difficulty,
        questionText: values.questionText,
        subjectId: values.subjectId,
        curriculumId: values.curriculumId,
        lessonId: values.lessonId,
        questionData: validatedQuestionData.data as QuestionData,
      };

      if (isEdit) {
        const response = await updateQuestionMutation.mutateAsync({
          id: currentRow.id,
          ...submissionData,
        });

        toast.success(t('questionBank.dialogs.success.update'));
        updateQuestion(response as Question);
      } else {
        const response = await createQuestionMutation.mutateAsync(
          submissionData as any
        );

        toast.success(t('questionBank.dialogs.success.create'));
        createQuestion(response as any);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }

    form.reset();
    setOpenedDialog(null);
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="min-w-[80vw]">
        <div className="w-full px-8">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('questionBank.dialogs.editTitle')
                : t('questionBank.dialogs.addTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t('questionBank.dialogs.editDescription')
                : t('questionBank.dialogs.addDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Form {...form}>
              <form
                id="question-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('questionBank.form.subject')}
                        </FormLabel>
                        <div>
                          <Combobox
                            options={
                              subjectsQuery.data?.subjects?.map((subject) => ({
                                label: subject.name,
                                value: subject.id,
                              })) ?? []
                            }
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={t('questionBank.form.selectSubject')}
                            searchPlaceholder={t('common.searchSubjects')}
                            emptyText={t('common.noSubjectsFound')}
                            disabled={subjectsQuery.isLoading}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="curriculumId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('questionBank.form.curriculum')}
                        </FormLabel>
                        <div>
                          <Combobox
                            options={
                              availableCurriculums.map((curriculum) => ({
                                label: curriculum.name,
                                value: curriculum.id,
                              })) ?? []
                            }
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            placeholder={t(
                              'questionBank.form.selectCurriculum'
                            )}
                            searchPlaceholder={t('common.curriculums')}
                            emptyText={t('common.curriculums')}
                            disabled={
                              !selectedSubjectId ||
                              availableCurriculums.length === 0
                            }
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lessonId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('questionBank.form.lesson')}</FormLabel>
                        <div>
                          <Combobox
                            options={
                              availableLessons.map((lesson) => ({
                                label: lesson.name,
                                value: lesson.id,
                              })) ?? []
                            }
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            placeholder={t('questionBank.form.selectLesson')}
                            searchPlaceholder={t('common.lessons')}
                            emptyText={t('common.lessons')}
                            disabled={
                              !selectedCurriculumId ||
                              availableLessons.length === 0
                            }
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel required>
                          {t('questionBank.form.difficulty')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t(
                                  'questionBank.form.selectDifficulty'
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(QuestionDifficulty).map(
                              (difficulty) => (
                                <SelectItem key={difficulty} value={difficulty}>
                                  {t(`questionDifficulties.${difficulty}`)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel required>
                        {t('questionBank.form.questionText')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder={t(
                            'questionBank.form.questionTextPlaceholder'
                          )}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            if (selectedType === 'FILL_IN_BLANK') {
                              const words = splitTextIntoWords(e.target.value);
                              const wordsCount = words.length;
                              // check correct answers still exist in the words
                              const correctAnswers =
                                watchedQuestionData.correctAnswers as number[];

                              if (!correctAnswers) {
                                return;
                              }

                              const newCorrectAnswers = correctAnswers.filter(
                                (value) => value < wordsCount
                              );

                              form.setValue(
                                'questionData.correctAnswers',
                                newCorrectAnswers
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <QuestionTypeFields
                  form={form}
                  selectedType={selectedType}
                  watchedQuestionData={watchedQuestionData}
                  watchedOptionFields={watchedOptionFields}
                />
              </form>
            </Form>
          </div>
          <DialogFooter>
            <LoadingButton
              type="submit"
              form="question-form"
              isLoading={
                updateQuestionMutation.isPending ||
                createQuestionMutation.isPending
              }
            >
              {isEdit ? t('common.save') : t('common.create')}
            </LoadingButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
