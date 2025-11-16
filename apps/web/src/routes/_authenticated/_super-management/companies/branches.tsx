import { createFileRoute } from '@tanstack/react-router';

import { Branches } from '@/features/admin/companies-and-branches/branches/Branches';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/_super-management/companies/branches'
)({
  component: Branches,
  validateSearch: () => ({}) as RouterInput['branch']['findAll'],
});
