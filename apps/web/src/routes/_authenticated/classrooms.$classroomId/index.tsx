import { createFileRoute } from '@tanstack/react-router';

import { ClassroomDetailsRoot } from '@/features/admin/classrooms/classroom-details/root/ClassroomDetailsRoot';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/'
)({
  component: ClassroomDetailsRoot,
});
