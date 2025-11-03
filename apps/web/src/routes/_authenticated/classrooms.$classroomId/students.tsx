import { createFileRoute } from '@tanstack/react-router';

import { ClassroomStudents } from '@/features/classrooms/classroom-details/students/ClassroomStudents';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/classrooms/$classroomId/students'
)({
  component: ClassroomStudents,
  validateSearch: () => (({}) as RouterInput['classroom']['findAllStudents']),
});
