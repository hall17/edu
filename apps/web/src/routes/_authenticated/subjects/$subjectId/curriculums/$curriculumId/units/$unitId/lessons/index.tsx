import { createFileRoute } from '@tanstack/react-router';

import { UnitLessons } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/UnitLessons';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/'
)({
  component: UnitLessons,
});
