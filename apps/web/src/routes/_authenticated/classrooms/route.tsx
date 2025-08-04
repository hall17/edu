import { createFileRoute } from '@tanstack/react-router';

import { ClassroomsRoot } from '@/features/classrooms';

export const Route = createFileRoute('/_authenticated/classrooms')({
  component: ClassroomsRoot,
});
