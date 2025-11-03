import { createFileRoute } from '@tanstack/react-router';

import { ClassroomSessions } from '@/features/classrooms/classroom-details/sessions/ClassroomSessions';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/sessions'
)({
  component: ClassroomSessions,
  validateSearch: () =>
    (({}) as RouterInput['classroom']['findAllIntegrationSessions']),
});
