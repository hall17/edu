import { QuestionDifficulty, QuestionType } from '@prisma/client';

export function getQuestionDifficultyBadgeVariant(
  difficulty: QuestionDifficulty
) {
  switch (difficulty) {
    case 'EASY':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    case 'HARD':
      return 'error';
  }
}

export function getQuestionTypeColor(questionType: QuestionType) {
  switch (questionType) {
    case QuestionType.MULTIPLE_CHOICE:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case QuestionType.TRUE_FALSE:
      return 'text-green-600 bg-green-50 border-green-200';
    case QuestionType.SHORT_ANSWER:
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case QuestionType.ESSAY:
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case QuestionType.FILL_IN_BLANK:
      return 'text-pink-600 bg-pink-50 border-pink-200';
    case QuestionType.MATCHING:
      return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    case QuestionType.ORDERING:
      return 'text-teal-600 bg-teal-50 border-teal-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getDifficultyColor(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case QuestionDifficulty.EASY:
      return 'text-green-600 bg-green-50 border-green-200';
    case QuestionDifficulty.MEDIUM:
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case QuestionDifficulty.HARD:
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}
