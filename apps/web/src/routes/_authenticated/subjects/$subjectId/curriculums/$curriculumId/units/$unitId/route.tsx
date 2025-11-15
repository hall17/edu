import { UnitDetailsLayout } from '@/features/subjects/subject-details/curriculums/curriculum-details/units/unit-details/UnitDetailsLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId'
)({
  component: UnitDetailsLayout,
});
