import { createFileRoute } from '@tanstack/react-router';

import { SubjectDetailsRoot } from '@/features/admin/subjects/subject-details/root/SubjectDetailsRoot';

export const Route = createFileRoute('/_authenticated/subjects/$subjectId/')({
  component: SubjectDetailsRoot,
});
