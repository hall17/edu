import { QuestionDifficulty } from '@edusama/server';
import { Target, TrendingUp, Award } from 'lucide-react';

// Difficulty Helpers
export function getDifficultyIcon(
  difficulty: QuestionDifficulty,
  size: 'sm' | 'md' | 'lg' = 'sm'
) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const iconClass = sizeClasses[size];

  switch (difficulty) {
    case QuestionDifficulty.EASY:
      return <Target className={iconClass} />;
    case QuestionDifficulty.MEDIUM:
      return <TrendingUp className={iconClass} />;
    case QuestionDifficulty.HARD:
      return <Award className={iconClass} />;
    default:
      return <Target className={iconClass} />;
  }
}
