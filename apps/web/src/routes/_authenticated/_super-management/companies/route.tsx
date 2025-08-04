import { createFileRoute } from '@tanstack/react-router';

import { CompaniesAndBranches } from '@/features/companies-and-branches';

export const Route = createFileRoute(
  '/_authenticated/_super-management/companies'
)({
  component: CompaniesAndBranches,
});
