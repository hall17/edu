import { createFileRoute } from '@tanstack/react-router';

import { CurriculumUnits } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/root/CurriculumUnits';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/_layout/units/'
)({
  component: CurriculumUnits,
});
