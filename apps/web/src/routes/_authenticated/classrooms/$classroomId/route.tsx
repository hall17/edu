import { createFileRoute } from '@tanstack/react-router';

import { ClassroomDetailsMain } from '@/features/classrooms/classroom-details/ClassroomDetails';

export const Route = createFileRoute('/_authenticated/classrooms/$classroomId')(
  {
    component: ClassroomDetailsMain,
  }
);
