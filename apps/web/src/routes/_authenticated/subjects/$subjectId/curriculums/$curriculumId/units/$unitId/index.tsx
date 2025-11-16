import { UnitDetailsRoot } from '@/features/subjects/subject-details/curriculums/curriculum-details/units/unit-details/root/UnitDetailsRoot';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/'
)({
  component: UnitDetailsRoot,
});
