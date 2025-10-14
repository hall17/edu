import { QuestionDifficulty, QuestionType } from '@edusama/server';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Circle,
  FileText,
  Hash,
  ListOrdered,
  Shuffle,
  Type,
  HelpCircle,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { AssessmentFormData } from '../AssessmentActionDialog';

import { getDifficultyIcon } from '@/components/getDifficultyIcon';
import { getQuestionTypeIcon } from '@/components/getQuestionTypeIcon';
import { LoadingButton } from '@/components/LoadingButton';
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
import { getQuestionTypeColor, getDifficultyColor } from '@/utils';

interface QuestionsTabProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function QuestionsTab({ form }: QuestionsTabProps) {
  const { t } = useTranslation();

  // Internal state for questions tab
  const [selectedQuestions, setSelectedQuestions] = useState<
    Array<{
      id: string;
      type: QuestionType;
      difficulty: QuestionDifficulty;
      questionText: string;
    }>
  >([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [questionType, setQuestionType] = useState<QuestionType | undefined>(
    undefined
  );
  const [questionDifficulty, setQuestionDifficulty] = useState<
    QuestionDifficulty | undefined
  >(undefined);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

  // Handle fetching random questions
  const handleFetchRandomQuestions = async () => {
    const subjectId = form.getValues('subjectId');
    const curriculumId = form.getValues('curriculumId');
    const lessonId = form.getValues('lessonId');

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
      const randomQuestions = await queryClient.fetchQuery(
        trpc.question.findQuestionsRandom.queryOptions({
          subjectId,
          curriculumId: curriculumId || undefined,
          lessonIds: lessonId ? [lessonId] : undefined,
          type: (questionType as QuestionType) || undefined,
          difficulty: (questionDifficulty as QuestionDifficulty) || undefined,
          count: questionCount,
        })
      );

      setSelectedQuestions(randomQuestions);
      const maxPoints = form.getValues('maxPoints') || 100;
      const pointsPerQuestion =
        Math.floor(maxPoints / randomQuestions.length) || 1;

      const formQuestions = randomQuestions.map(
        (
          question: {
            id: string;
            type: QuestionType;
            difficulty: QuestionDifficulty;
            questionText: string;
          },
          index: number
        ) => {
          return {
            order: index,
            questionId: question.id,
            points: pointsPerQuestion,
          };
        }
      );
      form.setValue('questions', formQuestions);
      toast.success(
        t('assessments.actionDialog.success.fetchedQuestions', {
          count: randomQuestions.length,
        })
      );
    } catch (error) {
      console.error('Failed to fetch random questions:', error);
      // toast.error('Failed to fetch random questions.');
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  // Handle removing a question from selection
  const handleRemoveQuestion = (questionId: string) => {
    const updatedQuestions = selectedQuestions.filter(
      (question) => question.id !== questionId
    );
    setSelectedQuestions(updatedQuestions);

    // Recalculate points for remaining questions
    const maxPoints = form.getValues('maxPoints') || 100;
    const pointsPerQuestion =
      Math.floor(maxPoints / updatedQuestions.length) || 1;

    const formQuestions = updatedQuestions.map((question, index) => ({
      order: index,
      questionId: question.id,
      points: pointsPerQuestion,
    }));
    form.setValue('questions', formQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Question Selection Controls */}
      <div className="flex items-end justify-between gap-8">
        <div className="flex w-full flex-1 gap-4">
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
        <div className="flex items-center justify-end">
          <LoadingButton
            type="button"
            onClick={handleFetchRandomQuestions}
            isLoading={isFetchingQuestions}
            variant="outline"
          >
            {t('assessments.actionDialog.fetchRandomQuestions')}
          </LoadingButton>
        </div>
      </div>

      {/* Selected Questions Display */}
      {selectedQuestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {t('assessments.actionDialog.selectedQuestions')} (
            {selectedQuestions.length})
          </h3>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {selectedQuestions.map((question) => (
              <Item key={question.id} variant="outline">
                <ItemContent>
                  <ItemTitle>{question.questionText}</ItemTitle>
                  <ItemDescription>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${getQuestionTypeColor(question.type)}`}
                      >
                        {getQuestionTypeIcon(question.type)}
                        <span className="font-medium">
                          {t(`questionTypes.${question.type}` as any)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${getDifficultyColor(question.difficulty)}`}
                      >
                        {getDifficultyIcon(question.difficulty)}
                        <span className="font-medium">
                          {t(
                            `questionDifficulties.${question.difficulty}` as any
                          )}
                        </span>
                      </div>
                    </div>
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.id)}
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
