import { createFileRoute } from '@tanstack/react-router';

import { SubjectsRoot } from '@/features/admin/subjects/root/SubjectsRoot';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/subjects/')({
  component: SubjectsRoot,
  validateSearch: () => ({}) as RouterInput['subject']['findAll'],
});
