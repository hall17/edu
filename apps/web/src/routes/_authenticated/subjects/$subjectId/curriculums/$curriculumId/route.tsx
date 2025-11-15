import { CurriculumDetailsLayout } from '@/features/subjects/subject-details/curriculums/curriculum-details/CurriculumDetailsLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId'
)({
  component: CurriculumDetailsLayout,
});
