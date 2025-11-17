import { createFileRoute } from '@tanstack/react-router';

import { UnitDetailsRoot } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/root/UnitDetailsRoot';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/_layout/'
)({
  component: UnitDetailsRoot,
});
