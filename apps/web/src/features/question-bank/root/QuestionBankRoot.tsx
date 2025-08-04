import { QuestionDifficulty } from '@prisma/client';
import { BookOpen, CircleQuestionMark, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { QuestionTypeCard } from './components/QuestionTypeCard';
import {
  QuestionBankRootProvider,
  useQuestionBankRootContext,
} from './QuestionBankRootContext';

import { getDifficultyIcon } from '@/components/getDifficultyIcon';
import { Main } from '@/components/layout/Main';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getQuestionDifficultyBadgeVariant } from '@/utils';

function QuestionBankRootContent() {
  const { t } = useTranslation();
  const { questionsMetadataQuery } = useQuestionBankRootContext();

  const questions = questionsMetadataQuery.data || [];

  // Calculate counts for each question type
  const typeCounts = questions.reduce(
    (acc, question) => {
      acc[question.type] = (acc[question.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const questionTypes = Array.from(
    new Set(questions.map((question) => question.type))
  ).sort((a, b) => {
    return a.localeCompare(b);
  });

  // Calculate total questions count
  const totalQuestions = questions.length;

  // Calculate difficulty distribution across all questions
  const difficultyCounts: Record<QuestionDifficulty, number> = {
    EASY: questions.filter((q) => q.difficulty === 'EASY').length,
    MEDIUM: questions.filter((q) => q.difficulty === 'MEDIUM').length,
    HARD: questions.filter((q) => q.difficulty === 'HARD').length,
  };

  // Calculate percentages for progress bars
  const difficultyPercentages: Record<QuestionDifficulty, number> = {
    EASY:
      totalQuestions > 0
        ? Math.round((difficultyCounts.EASY / totalQuestions) * 100)
        : 0,
    MEDIUM:
      totalQuestions > 0
        ? Math.round((difficultyCounts.MEDIUM / totalQuestions) * 100)
        : 0,
    HARD:
      totalQuestions > 0
        ? Math.round((difficultyCounts.HARD / totalQuestions) * 100)
        : 0,
  };

  return (
    <Main
      title={t('questionBank.title')}
      description={t('questionBank.description')}
    >
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        {/* Metadata Section */}
        <Card className="mb-6 border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              {t('questionBank.overview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total Questions Section */}
            <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <CircleQuestionMark className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {t('questionBank.totalQuestions')}
                  </p>
                  <p className="text-foreground text-2xl font-bold">
                    {totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="space-y-4">
              <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4" />
                {t('questionBank.difficultyDistribution')}
              </h4>
              <div className="space-y-3">
                {Object.entries(difficultyCounts).map(([difficulty, count]) => {
                  const percentage =
                    difficultyPercentages[difficulty as QuestionDifficulty];
                  return (
                    <div key={difficulty} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={getQuestionDifficultyBadgeVariant(
                            difficulty as QuestionDifficulty
                          )}
                          className="flex items-center gap-2 rounded-full px-3 py-1"
                        >
                          {getDifficultyIcon(
                            difficulty as QuestionDifficulty,
                            'md'
                          )}
                          <span className="text-sm font-medium">
                            {t(
                              `questionDifficulties.${difficulty as QuestionDifficulty}`
                            )}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground font-medium">
                            {count} ({percentage}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        variant={
                          difficulty === 'EASY'
                            ? 'success'
                            : difficulty === 'MEDIUM'
                              ? 'warning'
                              : 'destructive'
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 space-y-4 gap-x-3 lg:grid-cols-2">
          {questionTypes.map((type) => (
            <QuestionTypeCard key={type} type={type} />
          ))}
        </div>
      </div>
    </Main>
  );
}

export function QuestionBankRoot() {
  return (
    <QuestionBankRootProvider>
      <QuestionBankRootContent />
    </QuestionBankRootProvider>
  );
}
