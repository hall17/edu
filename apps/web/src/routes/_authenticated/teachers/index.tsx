import { createFileRoute } from '@tanstack/react-router';

import { Teachers } from '@/features/teachers/Teachers';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/teachers/')({
  component: Teachers,
  // validateSearch: zodValidator(defaultFilterSchema),
  validateSearch: () => ({}) as RouterInput['user']['findAll'],
});
