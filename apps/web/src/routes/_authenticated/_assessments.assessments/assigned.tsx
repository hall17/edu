import { createFileRoute } from '@tanstack/react-router';

import { AssessmentAssignments } from '@/features/assessments/assignments/AssessmentAssignments';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/_assessments/assessments/assigned'
)({
  component: AssessmentAssignments,
  validateSearch: () =>
    ({}) as RouterInput['assessment']['findAllClassroomIntegrationAssessments'],
});
