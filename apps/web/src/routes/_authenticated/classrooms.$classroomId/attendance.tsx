import { createFileRoute } from '@tanstack/react-router';

import { ClassroomAttendance } from '@/features/classrooms/classroom-details/attendance';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/attendance'
)({
  component: ClassroomAttendance,
});
