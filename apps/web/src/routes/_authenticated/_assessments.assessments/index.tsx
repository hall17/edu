import { createFileRoute } from '@tanstack/react-router';

import { Assessments } from '@/features/admin/assessments/Assessments';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/_assessments/assessments/'
)({
  component: Assessments,
  validateSearch: () => ({}) as RouterInput['assessment']['findAll'],
});
