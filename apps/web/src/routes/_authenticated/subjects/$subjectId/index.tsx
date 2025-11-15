import { SubjectDetailsRoot } from '@/features/subjects/subject-details/root/SubjectDetailsRoot';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/subjects/$subjectId/')({
  component: SubjectDetailsRoot,
});
