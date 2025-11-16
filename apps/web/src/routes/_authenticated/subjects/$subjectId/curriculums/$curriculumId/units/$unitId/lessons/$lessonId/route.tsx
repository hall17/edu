import { createFileRoute } from '@tanstack/react-router';

import { LessonDetailsLayout } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/lesson-details/LessonDetailsLayout';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons/$lessonId'
)({
  component: LessonDetailsLayout,
});
