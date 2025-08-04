import { createFileRoute } from '@tanstack/react-router';

import { Classrooms } from '@/features/classrooms/classrooms/Classrooms';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/classrooms/')({
  component: Classrooms,
  validateSearch: () => ({}) as RouterInput['classroom']['findAll'],
});
