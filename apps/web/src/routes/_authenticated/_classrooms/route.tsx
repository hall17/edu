import { createFileRoute } from '@tanstack/react-router';

import { ClassroomsRoot } from '@/features/admin/classrooms';

export const Route = createFileRoute('/_authenticated/_classrooms')({
  component: ClassroomsRoot,
});
