import { createFileRoute } from '@tanstack/react-router';

import { Tasks } from '@/features/admin/tasks';

export const Route = createFileRoute('/_authenticated/tasks/')({
  component: Tasks,
});
