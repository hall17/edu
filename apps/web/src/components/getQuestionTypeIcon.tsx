import { QuestionType } from '@prisma/client';
import {
  Circle,
  FileText,
  Hash,
  ListOrdered,
  Shuffle,
  Type,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

// Question Type Helpers
export function getQuestionTypeIcon(
  questionType: QuestionType,
  size: 'sm' | 'md' | 'lg' = 'sm'
) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const iconClass = sizeClasses[size];

  switch (questionType) {
    case QuestionType.MULTIPLE_CHOICE:
      return <Circle className={iconClass} />;
    case QuestionType.TRUE_FALSE:
      return <CheckCircle2 className={iconClass} />;
    case QuestionType.SHORT_ANSWER:
      return <Type className={iconClass} />;
    case QuestionType.ESSAY:
      return <FileText className={iconClass} />;
    case QuestionType.FILL_IN_BLANK:
      return <Hash className={iconClass} />;
    case QuestionType.MATCHING:
      return <Shuffle className={iconClass} />;
    case QuestionType.ORDERING:
      return <ListOrdered className={iconClass} />;
    default:
      return <HelpCircle className={iconClass} />;
  }
}
