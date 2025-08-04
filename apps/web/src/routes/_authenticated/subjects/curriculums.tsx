import { createFileRoute } from '@tanstack/react-router';

import { Curriculums } from '@/features/subjects/curriculums';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/subjects/curriculums')({
  component: Curriculums,
  validateSearch: () => ({}) as RouterInput['curriculum']['findAll'],
});
