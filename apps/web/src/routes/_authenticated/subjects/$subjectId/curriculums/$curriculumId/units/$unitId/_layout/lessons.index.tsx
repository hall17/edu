import { createFileRoute } from '@tanstack/react-router';

import { UnitLessons } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/root/UnitLessons';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/_layout/lessons/'
)({
  component: UnitLessons,
});
