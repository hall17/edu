import { CurriculumDetailsRoot } from '@/features/subjects/subject-details/curriculums/curriculum-details/root/CurriculumDetailsRoot';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/'
)({
  component: CurriculumDetailsRoot,
});
