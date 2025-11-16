import { createFileRoute } from '@tanstack/react-router';

import { CurriculumDetailsLayout } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/CurriculumDetailsLayout';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId'
)({
  component: CurriculumDetailsLayout,
});
