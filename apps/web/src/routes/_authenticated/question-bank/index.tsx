import { createFileRoute } from '@tanstack/react-router';

import { QuestionBankRoot } from '@/features/admin/question-bank/root/QuestionBankRoot';

export const Route = createFileRoute('/_authenticated/question-bank/')({
  component: QuestionBankRoot,
});
