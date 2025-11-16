import { createFileRoute } from '@tanstack/react-router';

import { Students } from '@/features/admin/students/Students';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/students/')({
  component: Students,
  validateSearch: () => ({}) as RouterInput['student']['findAll'],
});
