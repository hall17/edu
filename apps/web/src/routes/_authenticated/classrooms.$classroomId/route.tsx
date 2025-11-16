import { createFileRoute } from '@tanstack/react-router';

import { ClassroomDetails } from '@/features/admin/classrooms/classroom-details/ClassroomDetails';

export const Route = createFileRoute('/_authenticated/classrooms/$classroomId')(
  {
    component: ClassroomDetails,
  }
);
