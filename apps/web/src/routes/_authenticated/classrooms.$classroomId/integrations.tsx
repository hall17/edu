import { createFileRoute } from '@tanstack/react-router';

import { ClassroomDetailsRoot } from '@/features/classrooms/classroom-details/root/ClassroomDetailsRoot';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/integrations'
)({
  component: ClassroomDetailsRoot,
  validateSearch: () =>
    (({}) as RouterInput['classroom']['findAllClassroomIntegrations']),
});
