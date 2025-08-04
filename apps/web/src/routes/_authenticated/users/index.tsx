import { createFileRoute } from '@tanstack/react-router';

import { Users } from '@/features/users/users/Users';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/users/')({
  component: Users,
  validateSearch: () => ({}) as RouterInput['user']['findAll'],
});
