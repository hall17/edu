import { UnitLessons } from '@/features/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/UnitLessons';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/'
)({
  component: UnitLessons,
});
