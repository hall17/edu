import { LessonMaterials } from '@/features/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/lesson-details/materials/LessonMaterials';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/$lessonId/materials'
)({
  component: LessonMaterials,
});
