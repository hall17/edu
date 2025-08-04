import { createFileRoute } from '@tanstack/react-router';

import { Subjects } from '@/features/subjects/subjects';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/subjects/')({
  component: Subjects,
  validateSearch: () => ({}) as RouterInput['subject']['findAll'],
});
