import { createFileRoute } from '@tanstack/react-router';

import { AssessmentsRoot } from '@/features/admin/assessments';

export const Route = createFileRoute('/_authenticated/_assessments')({
  component: AssessmentsRoot,
});
