import { createFileRoute } from '@tanstack/react-router';

import { Modules } from '@/features/admin/modules/Modules';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/modules/')({
  component: Modules,
  validateSearch: () => ({}) as RouterInput['module']['findAll'],
});
