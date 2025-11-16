import { createFileRoute } from '@tanstack/react-router';

import { SubjectTeachers } from '@/features/subjects/subject-details/teachers';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/teachers'
)({
  component: SubjectTeachers,
});
