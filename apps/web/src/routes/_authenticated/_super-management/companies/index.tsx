import { createFileRoute } from '@tanstack/react-router';

import { Companies } from '@/features/admin/companies-and-branches/companies/Companies';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute(
  '/_authenticated/_super-management/companies/'
)({
  component: Companies,
  validateSearch: () => ({}) as RouterInput['company']['findAll'],
});
