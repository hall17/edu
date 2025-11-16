import { createFileRoute } from '@tanstack/react-router';

import { ClassroomTemplates } from '@/features/admin/classrooms/templates/ClassroomTemplates';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/_classrooms/classrooms/templates'
)({
  component: ClassroomTemplates,
  validateSearch: () => ({}) as RouterInput['classroomTemplate']['findAll'],
});
