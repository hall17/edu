import { CurriculumUnits } from '@/features/subjects/subject-details/curriculums/curriculum-details/units/CurriculumUnits';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/'
)({
  component: CurriculumUnits,
});
