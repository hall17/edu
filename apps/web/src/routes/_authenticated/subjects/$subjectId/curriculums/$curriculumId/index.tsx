import { createFileRoute } from '@tanstack/react-router';

import { CurriculumDetailsRoot } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/root/CurriculumDetailsRoot';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/'
)({
  component: CurriculumDetailsRoot,
});
