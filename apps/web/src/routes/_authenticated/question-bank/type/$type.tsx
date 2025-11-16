import { createFileRoute } from '@tanstack/react-router';

import { QuestionBankTypeView } from '@/features/admin/question-bank/type/QuestionBankTypeView';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/question-bank/type/$type'
)({
  component: QuestionBankTypeView,
  validateSearch: () => ({}) as RouterInput['question']['findAll'],
});
