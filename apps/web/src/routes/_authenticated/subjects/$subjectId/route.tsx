import { createFileRoute } from '@tanstack/react-router';

import { SubjectDetailsLayout } from '@/features/admin/subjects/subject-details/SubjectDetailsLayout';

export const Route = createFileRoute('/_authenticated/subjects/$subjectId')({
  component: SubjectDetailsLayout,
});
