import { createFileRoute } from '@tanstack/react-router';

import { Attendance } from '@/features/admin/attendance/Attendance';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/attendance/')({
  component: Attendance,
  validateSearch: () =>
    ({}) as RouterInput['classroom']['findAllClassroomIntegrations'],
});
