import { QuestionDifficulty, QuestionType } from '@edusama/common';
import { Link } from '@tanstack/react-router';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useQuestionBankRootContext } from '../QuestionBankRootContext';

import { getDifficultyIcon } from '@/components/getDifficultyIcon';
import { getQuestionTypeIcon } from '@/components/getQuestionTypeIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  getQuestionDifficultyBadgeVariant,
  getStatusBadgeVariant,
} from '@/utils';

interface QuestionTypeCardProps {
  type: QuestionType;
}

export function QuestionTypeCard({ type }: QuestionTypeCardProps) {
  const { t } = useTranslation();
  const { questions } = useQuestionBankRootContext();

  const typeTranslation = t(`questionTypes.${type}`);
  // Use provided count or calculate from questions data if available
  const typeCount = questions?.filter((q) => q.type === type).length ?? 0;
  const totalQuestions = questions?.length ?? 0;
  const ratio =
    totalQuestions > 0 ? ((typeCount / totalQuestions) * 100).toFixed(0) : '0';

  // Calculate difficulty breakdown
  const difficultyCounts: Record<QuestionDifficulty, number> = {
    EASY:
      questions?.filter((q) => q.type === type && q.difficulty === 'EASY')
        .length ?? 0,
    MEDIUM:
      questions?.filter((q) => q.type === type && q.difficulty === 'MEDIUM')
        .length ?? 0,
    HARD:
      questions?.filter((q) => q.type === type && q.difficulty === 'HARD')
        .length ?? 0,
  };

  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'HARD':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Calculate percentages for progress bars
  const difficultyPercentages: Record<QuestionDifficulty, number> = {
    EASY:
      typeCount > 0 ? Math.round((difficultyCounts.EASY / typeCount) * 100) : 0,
    MEDIUM:
      typeCount > 0
        ? Math.round((difficultyCounts.MEDIUM / typeCount) * 100)
        : 0,
    HARD:
      typeCount > 0 ? Math.round((difficultyCounts.HARD / typeCount) * 100) : 0,
  };

  return (
    <Card className="group cursor-pointer bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Type Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl border`}
            >
              {getQuestionTypeIcon(type)}
            </div>

            {/* Type Info */}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl font-bold text-gray-900">
                {typeTranslation}
              </CardTitle>
              <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{typeCount}</span>
                  <span>{t('common.questions')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">%{ratio}</span>
                  <span>{t('common.ratio')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Go to Details Button */}
          <Button>
            <Link
              to="/question-bank/type/$type"
              params={{ type: type.toLowerCase() }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {t('common.details')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Difficulty Distribution */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            {t('questionBank.difficultyDistribution')}
          </h4>

          <div className="space-y-3">
            {Object.entries(difficultyCounts).map(([difficulty, count]) => {
              const percentage =
                difficultyPercentages[difficulty as QuestionDifficulty];
              if (count === 0) return null; // Don't show zero counts

              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${getDifficultyColor(difficulty as QuestionDifficulty)}`}
                    >
                      {getDifficultyIcon(
                        difficulty as QuestionDifficulty,
                        'sm'
                      )}
                      <span className="text-sm font-medium">
                        {t(
                          `questionDifficulties.${difficulty as QuestionDifficulty}`
                        )}
                      </span>
                    </div>
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
  );
}
