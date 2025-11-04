import { QuestionDifficulty, QuestionType, ScoringType } from '@edusama/server';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { AssessmentFormData } from './AssessmentActionDialog';
import { SeeQuestionsDialog } from './SeeQuestionsDialog';

import { getDifficultyIcon } from '@/components/getDifficultyIcon';
import { getQuestionTypeIcon } from '@/components/getQuestionTypeIcon';
// import InfiniteScroll from '@/components/infinite-scroll';
import { LoadingButton } from '@/components/LoadingButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { queryClient, trpc } from '@/lib/trpc';
import {
  getQuestionTypeColor,
  getDifficultyColor,
  getQuestionDifficultyBadgeVariant,
} from '@/utils';

interface QuestionsStepProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function QuestionsStep({ form }: QuestionsStepProps) {
  const { t } = useTranslation();

  const questions = form.watch('questions') || [];

  const [questionCount, setQuestionCount] = useState(10);
  const [questionType, setQuestionType] = useState<QuestionType | undefined>(
    undefined
  );
  const [questionDifficulty, setQuestionDifficulty] = useState<
    QuestionDifficulty | undefined
  >(undefined);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

  const [seeQuestionsDialogOpen, setSeeQuestionsDialogOpen] = useState(false);

  async function handleFetchRandomQuestions() {
    const subjectId = form.getValues('subjectId');
    const curriculumIds = form.getValues('curriculumIds');
    const lessonIds = form.getValues('lessonIds');
    const scoringType = form.getValues('scoringType');

    if (!subjectId) {
      toast.error(t('assessments.actionDialog.errors.selectSubject'));
      return;
    }

    if (!questionCount || questionCount < 1) {
      toast.error(t('assessments.actionDialog.errors.invalidQuestionCount'));
      return;
    }

    setIsFetchingQuestions(true);

    try {
      const excludeQuestionIds =
        form.getValues('questions')?.map((q) => q.questionId) || [];
      const randomQuestions = await queryClient.fetchQuery(
        trpc.question.findQuestionsRandom.queryOptions({
          subjectId,
          curriculumIds: curriculumIds || undefined,
          lessonIds: lessonIds || undefined,
          type: (questionType as QuestionType) || undefined,
          difficulty: (questionDifficulty as QuestionDifficulty) || undefined,
          count: questionCount,
          excludeQuestionIds,
        })
      );

      if (randomQuestions.length === 0) {
        toast.error(t('assessments.actionDialog.errors.noQuestionsFound'));
      } else if (randomQuestions.length < questionCount) {
        toast.error(t('assessments.actionDialog.errors.notEnoughQuestions'));
      } else {
        toast.success(
          t('assessments.actionDialog.success.fetchedQuestions', {
            count: randomQuestions.length,
          })
        );
      }

      const currentQuestions = form.getValues('questions') || [];
      const maxPoints = form.getValues('maxPoints') || 100;
      const totalQuestions = currentQuestions.length + randomQuestions.length;
      const pointsPerQuestion = Math.floor(maxPoints / totalQuestions) || 1;

      const newQuestions = (randomQuestions as any[]).map((question, index) => {
        return {
          order: currentQuestions.length + index + 1,
          questionId: question.id,
          points: pointsPerQuestion,
          question: {
            id: question.id,
            questionText: question.questionText,
            type: question.type,
            difficulty: question.difficulty,
          },
        };
      });

      const allQuestions = currentQuestions.concat(newQuestions);

      const updatedQuestions = allQuestions.map((q, idx) => {
        return {
          ...q,
          questionId: q.questionId,
          order: idx + 1,
          points:
            scoringType === ScoringType.AUTOMATIC
              ? pointsPerQuestion
              : q.points,
        };
      });

      form.setValue('questions', updatedQuestions);
    } catch (error) {
      console.error('Failed to fetch random questions:', error);
      toast.error(t('assessments.actionDialog.errors.fetchQuestionsFailed'));
    } finally {
      setIsFetchingQuestions(false);
    }
  }

  function handleRemoveQuestion(questionId: string) {
    const currentQuestions = form.getValues('questions') || [];
    const filteredQuestions = currentQuestions.filter(
      (question) => question.questionId !== questionId
    );

    const maxPoints = form.getValues('maxPoints') || 100;
    const pointsPerQuestion =
      Math.floor(maxPoints / filteredQuestions.length) || 1;

    const reorderedQuestions = filteredQuestions.map((q, idx) => ({
      ...q,
      questionId: q.questionId,
      order: idx + 1,
      points: pointsPerQuestion,
    }));

    form.setValue('questions', reorderedQuestions);
  }

  return (
    <div className="space-y-6">
      {/* Question Selection Controls */}
      <div className="flex items-end justify-between gap-8">
        <div className="flex w-full flex-1 gap-4">
          {/* ...existing code for questionCount, questionType, questionDifficulty ... */}
          <div>
            <label className="text-sm font-medium">
              {t('assessments.actionDialog.questionCount')}
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
              className="w-28"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium">
              {t('assessments.actionDialog.questionType')}
            </label>
            <Select
              value={questionType}
              onValueChange={(value) => setQuestionType(value as QuestionType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t('assessments.actionDialog.selectQuestionType')}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuestionType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`questionTypes.${type as QuestionType}` as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="text-sm font-medium">
              {t('assessments.actionDialog.questionDifficulty')}
            </label>
            <Select
              value={questionDifficulty}
              onValueChange={(value) =>
                setQuestionDifficulty(value as QuestionDifficulty)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t('assessments.actionDialog.selectDifficulty')}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuestionDifficulty).map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {t(
                      `questionDifficulties.${difficulty as QuestionDifficulty}` as any
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <LoadingButton
            type="button"
            onClick={handleFetchRandomQuestions}
            isLoading={isFetchingQuestions}
            variant="outline"
          >
            {t('assessments.actionDialog.fetchRandomQuestions')}
          </LoadingButton>
          {/* See Questions Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setSeeQuestionsDialogOpen(true)}
          >
            {t('assessments.actionDialog.seeQuestions', 'See Questions')}
          </Button>
        </div>
      </div>

      <SeeQuestionsDialog
        form={form}
        questionType={questionType}
        questionDifficulty={questionDifficulty}
        seeQuestionsDialogOpen={seeQuestionsDialogOpen}
        setSeeQuestionsDialogOpen={setSeeQuestionsDialogOpen}
      />

      {/* Added Questions Display */}
      {questions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {t('assessments.actionDialog.selectedQuestions')} (
            {questions.length})
          </h3>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {questions.map((question) => (
              <Item key={question.questionId} variant="outline">
                <ItemContent>
                  <ItemTitle>{question.question?.questionText}</ItemTitle>
                  <ItemDescription>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${getQuestionTypeColor(question.question?.type)}`}
                      >
                        {getQuestionTypeIcon(question.question?.type)}
                        <span className="font-medium">
                          {t(`questionTypes.${question.question?.type}` as any)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${getDifficultyColor(question.question?.difficulty)}`}
                      >
                        {getDifficultyIcon(question.question?.difficulty)}
                        <Badge
                          variant={getQuestionDifficultyBadgeVariant(
                            question.question?.difficulty as QuestionDifficulty
                          )}
                          className="capitalize"
                        >
                          {t(
                            `questionDifficulties.${question.question!.difficulty}`
                          )}
                        </Badge>
                      </div>
                    </div>
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.questionId)}
                  >
                    {t('common.remove')}
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
