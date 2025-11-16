import { createFileRoute } from '@tanstack/react-router';

import { LessonMaterials } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/lesson-details/materials/LessonMaterials';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/$lessonId/materials'
)({
  component: LessonMaterials,
});
