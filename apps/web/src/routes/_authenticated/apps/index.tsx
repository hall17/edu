import { createFileRoute } from '@tanstack/react-router';

import { Apps } from '@/features/admin/apps';

export const Route = createFileRoute('/_authenticated/apps/')({
  component: Apps,
});
