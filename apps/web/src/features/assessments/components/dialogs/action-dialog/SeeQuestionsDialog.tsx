import { QuestionDifficulty, QuestionType } from '@edusama/server';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon, Loader2Icon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AssessmentFormData } from './AssessmentActionDialog';

import { getDifficultyIcon } from '@/components/getDifficultyIcon';
import InfiniteScroll from '@/components/infinite-scroll';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Spinner } from '@/components/ui/spinner';
import { trpc } from '@/lib/trpc';
import { getQuestionDifficultyBadgeVariant } from '@/utils';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

interface QuestionsStepProps {
  form: UseFormReturn<AssessmentFormData>;
  questionType: QuestionType | undefined;
  questionDifficulty: QuestionDifficulty | undefined;
  seeQuestionsDialogOpen: boolean;
  setSeeQuestionsDialogOpen: (open: boolean) => void;
}

export function SeeQuestionsDialog({
  form,
  questionType,
  questionDifficulty,
  seeQuestionsDialogOpen,
  setSeeQuestionsDialogOpen,
}: QuestionsStepProps) {
  const { t } = useTranslation();
  const questions = form.watch('questions') || [];
  const selectedQuestionIds = questions.map((question) => question.questionId);

  const [seeQuestionsSearch, setSeeQuestionsSearch] = useState('');

  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);

  // Fetch questions with filters
  const seeQuestionsQuery = useQuery(
    trpc.question.findAll.queryOptions(
      {
        size,
        infiniteScroll: true,
        type: questionType ? [questionType] : undefined,
        difficulty: questionDifficulty ? [questionDifficulty] : undefined,
        q: seeQuestionsSearch || undefined,
        subjectIds: [form.getValues('subjectId')],
        curriculumIds: form.getValues('curriculumIds'),
        lessonIds: form.getValues('lessonIds'),
      },
      {
        enabled: seeQuestionsDialogOpen,
        refetchOnWindowFocus: false,
      }
    )
  );

  const hasMore =
    seeQuestionsQuery.data?.questions &&
    seeQuestionsQuery.data?.questions?.length > 0 &&
    size < seeQuestionsQuery.data?.pagination?.count
      ? true
      : false;

  function handleAddQuestion(questionId: string) {
    const currentQuestions = form.getValues('questions') || [];
    const questionExists = currentQuestions.some(
      (q) => q.questionId === questionId
    );

    const question = seeQuestionsQuery.data?.questions?.find(
      (q) => q.id === questionId
    );

    if (!question) {
      return;
    }

    if (!questionExists) {
      const maxPoints = form.getValues('maxPoints') || 100;
      const totalQuestions = currentQuestions.length + 1;
      const pointsPerQuestion = Math.floor(maxPoints / totalQuestions) || 1;

      const recalculatedQuestions = [
        ...currentQuestions,
        {
          questionId,
          points: 0,
          order: currentQuestions.length + 1,
          question: {
            id: question.id,
            questionText: question.questionText,
            type: question.type,
            difficulty: question.difficulty,
          },
        },
      ].map((q) => ({
        ...q,
        points: pointsPerQuestion,
      }));

      form.setValue('questions', recalculatedQuestions);
    }
  }

  return (
    <CommandDialog
      open={seeQuestionsDialogOpen}
      onOpenChange={(open) => {
        setSeeQuestionsDialogOpen(open);
        if (!open) {
          setSeeQuestionsSearch('');
          setSize(DEFAULT_PAGE_SIZE);
        }
      }}
      title={t('assessments.actionDialog.seeQuestionsTitle', 'Questions')}
      description={t(
        'assessments.actionDialog.seeQuestionsDescription',
        'Questions matching your filters.'
      )}
      commandProps={{ shouldFilter: false }}
    >
      <CommandInput
        placeholder={t(
          'assessments.actionDialog.seeQuestionsSearch',
          'Search questions...'
        )}
        onValueChange={setSeeQuestionsSearch}
      />
      <CommandList className="max-h-[600px]">
        {seeQuestionsQuery.isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <CommandGroup
            heading={t(
              'assessments.actionDialog.seeQuestionsAvailable',
              'Available Questions'
            )}
          >
            <div className="max-h-[500px] w-full overflow-y-auto px-4">
              <div className="flex w-full flex-col items-center gap-3">
                {seeQuestionsQuery.data?.questions?.length ? (
                  <>
                    {seeQuestionsQuery.data.questions.map((question: any) => {
                      const isAdded = selectedQuestionIds.includes(question.id);
                      return (
                        <CommandItem
                          key={question.id}
                          className="flex w-full items-center justify-between gap-2"
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-medium">
                              {question.questionText}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                {t(`questionTypes.${question.type}` as any)}{' '}
                                |{' '}
                              </span>
                              <Badge
                                variant={getQuestionDifficultyBadgeVariant(
                                  question.difficulty as QuestionDifficulty
                                )}
                                className="capitalize"
                              >
                                {getDifficultyIcon(question.difficulty)}
                                {t(
                                  `questionDifficulties.${question.difficulty}` as any
                                )}
                              </Badge>
                            </div>
                          </div>
                          {isAdded ? (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <CheckIcon className="h-3 w-3" />
                              {t(
                                'assessments.actionDialog.questionAdded',
                                'Eklendi'
                              )}
                            </Badge>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddQuestion(question.id)}
                              className="flex items-center gap-1"
                            >
                              <PlusIcon className="h-4 w-4" />
                              {t(
                                'assessments.actionDialog.addQuestion',
                                'Ekle'
                              )}
                            </Button>
                          )}
                        </CommandItem>
                      );
                    })}
                    {hasMore && (
                      <InfiniteScroll
                        hasMore={hasMore}
                        isLoading={seeQuestionsQuery.isFetching}
                        next={() => setSize(size + DEFAULT_PAGE_SIZE)}
                        threshold={1}
                      >
                        <div className="my-4 flex w-full justify-center">
                          <Spinner className="h-8 w-8" />
                        </div>
                      </InfiniteScroll>
                    )}
                  </>
                ) : (
                  <div className="text-muted-foreground px-4 py-2 text-sm">
                    {t(
                      'assessments.actionDialog.seeQuestionsNoResults',
                      'No questions found.'
                    )}
                  </div>
                )}
              </div>
            </div>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
