import { createFileRoute } from '@tanstack/react-router';

import { ClassroomCalendar } from '@/features/classrooms/classroom-details/calendar/ClassroomCalendar';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/calendar'
)({
  component: ClassroomCalendar,
  validateSearch: () =>
    ({}) as RouterInput['classroom']['findAllIntegrationSessions'],
});
