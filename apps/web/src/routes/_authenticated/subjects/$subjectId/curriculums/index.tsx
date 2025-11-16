import { createFileRoute } from '@tanstack/react-router';

import { SubjectCurriculums } from '@/features/admin/subjects/subject-details/curriculums/root/SubjectCurriculums';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/'
)({
  component: SubjectCurriculums,
});
