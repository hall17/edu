import { SubjectDetailsLayout } from '@/features/subjects/subject-details/SubjectDetailsLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/subjects/$subjectId')({
  component: SubjectDetailsLayout,
});
