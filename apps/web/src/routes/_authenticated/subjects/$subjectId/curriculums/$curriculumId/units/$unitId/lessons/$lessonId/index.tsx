import { createFileRoute } from '@tanstack/react-router';

import { LessonDetailsRoot } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/lesson-details/root/LessonDetailsRoot';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/$lessonId/'
)({
  component: LessonDetailsRoot,
});
