import { createFileRoute } from '@tanstack/react-router';

import { UnitDetailsLayout } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/UnitDetailsLayout';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId'
)({
  component: UnitDetailsLayout,
});
