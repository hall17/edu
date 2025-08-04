import { createFileRoute } from '@tanstack/react-router';

import { BranchSettings } from '@/features/branch-settings/BranchSettings';

export const Route = createFileRoute('/_authenticated/branch-settings/')({
  component: BranchSettings,
});
