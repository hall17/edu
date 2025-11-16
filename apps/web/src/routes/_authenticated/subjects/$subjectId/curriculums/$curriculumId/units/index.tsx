import { createFileRoute } from '@tanstack/react-router';

import { CurriculumUnits } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/CurriculumUnits';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/'
)({
  component: CurriculumUnits,
});
