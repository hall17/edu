import { createFileRoute } from '@tanstack/react-router';

import { Roles } from '@/features/users/roles/Roles';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/users/roles')({
  component: Roles,
  validateSearch: () => ({}) as RouterInput['role']['findAll'],
});
