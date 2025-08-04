import { createFileRoute } from '@tanstack/react-router';

import { ClassroomTemplates } from '@/features/classrooms/templates/ClassroomTemplates';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/classrooms/templates')({
  component: ClassroomTemplates,
  validateSearch: () => ({}) as RouterInput['classroomTemplate']['findAll'],
});
