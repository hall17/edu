import { createFileRoute, Outlet } from '@tanstack/react-router';

import { QuestionBankRoot } from '@/features/question-bank/root/QuestionBankRoot';

export const Route = createFileRoute('/_authenticated/question-bank')({
  component: () => <Outlet />,
});
