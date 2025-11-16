import { createFileRoute } from '@tanstack/react-router';

import { Parents } from '@/features/admin/parents/Parents';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/parents/')({
  component: Parents,
  validateSearch: () => ({}) as RouterInput['parent']['findAll'],
});
