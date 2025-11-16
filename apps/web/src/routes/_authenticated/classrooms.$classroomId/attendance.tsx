import { createFileRoute } from '@tanstack/react-router';

import { ClassroomAttendance } from '@/features/admin/classrooms/classroom-details/attendance';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/attendance'
)({
  component: ClassroomAttendance,
});
